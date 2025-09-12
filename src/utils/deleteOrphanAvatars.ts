import { supabase } from '@/src/lib/supabase';

const BUCKET = 'avatars';

/**
 * Extrait le path "bucket/path" depuis une URL publique Supabase.
 * ex: https://.../object/public/avatars/<PATH> -> retourne <PATH>
 */
function extractPathFromPublicUrl(url: string, bucket = BUCKET): string | null {
  try {
    const marker = `/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.slice(idx + marker.length);
  } catch {
    return null;
  }
}

/**
 * Supprime tous les fichiers du dossier {userId}/ dans le bucket,
 * sauf `currentPath` (ou celui déduit de `currentUrl` si bucket public).
 *
 * ⚠️ Nécessite une policy DELETE sur storage.objects limitée au dossier de l'utilisateur.
 */
export async function deleteOrphanAvatars(params: {
  userId: string;
  currentPath?: string; // ex: "USER_ID/abc.jpg"
  currentUrl?: string; // ex: URL publique (si bucket public)
}) {
  const { userId, currentPath, currentUrl } = params;
  if (!userId) throw new Error('deleteOrphanAvatars: missing userId');

  // 1) Détermine le path courant à conserver
  const keepPath = currentPath ?? (currentUrl ? extractPathFromPublicUrl(currentUrl) : null);

  // 2) Liste les fichiers du dossier utilisateur
  const { data: files, error: listErr } = await supabase.storage
    .from(BUCKET)
    .list(userId, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

  if (listErr) throw listErr;

  if (!files || files.length === 0) {
    return { deleted: 0, kept: keepPath ?? null };
  }

  // 3) Construit les chemins complets et filtre ceux à supprimer
  const toDelete = files
    .map((f) => `${userId}/${f.name}`)
    .filter((p) => (keepPath ? p !== keepPath : true));

  if (toDelete.length === 0) {
    return { deleted: 0, kept: keepPath ?? null };
  }

  // 4) Supprime en lot
  const { error: delErr } = await supabase.storage.from(BUCKET).remove(toDelete);
  if (delErr) throw delErr;

  return { deleted: toDelete.length, kept: keepPath ?? null };
}
