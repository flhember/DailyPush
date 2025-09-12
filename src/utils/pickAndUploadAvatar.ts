import * as ImagePicker from 'expo-image-picker';
import { File, Directory, Paths } from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { Platform } from 'react-native';
import { supabase } from '@/src/lib/supabase';

const BUCKET = 'avatars';

export async function pickAndUploadAvatar(userId: string): Promise<string | null> {
  if (!userId) throw new Error('Utilisateur non authentifié');

  // 1) Permission (iOS plus strict en SDK 54)
  if (Platform.OS !== 'web') {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      throw new Error("Autorise l'accès à tes photos pour changer l’avatar.");
    }
  }

  // 2) Picker (API récente)
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
    exif: false,
  });
  if (res.canceled) return null;

  // 3) Fichier local
  const asset = res.assets[0];
  let uri = asset.uri;

  if (!uri.startsWith('file://')) {
    const cacheDir = new Directory(Paths.cache, 'avatars');
    await cacheDir.create({ intermediates: true });

    const tempFile = new File(cacheDir, `${randomUUID()}.jpg`);
    const resp = await fetch(uri);
    const bytes = new Uint8Array(await resp.arrayBuffer());
    await tempFile.write(bytes);
    uri = tempFile.uri;
  }

  // 4) Lire les octets (Uint8Array) + deviner le mime
  const srcFile = new File(uri);
  const bytes = await srcFile.bytes();
  const nameOrUri = (srcFile.name || uri).toLowerCase();
  const ext = nameOrUri.endsWith('.png') ? 'png' : 'jpg';
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

  // 5) Upload Supabase (bucket public)
  const filePath = `${userId}/${randomUUID()}.${ext}`;
  const { data: up, error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, bytes, { contentType: mime, upsert: true });
  if (uploadErr) throw uploadErr;

  // 6) URL publique
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(up!.path);
  return pub.publicUrl ?? null;
}
