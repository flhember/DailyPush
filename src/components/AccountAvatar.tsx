import { Pressable } from 'react-native';
import { YStack, Avatar, SizableText, Spinner, XStack } from 'tamagui';
import { Edit3 } from '@tamagui/lucide-icons';

export function AccountAvatar({
  url,
  initials,
  uploading,
  onPick,
}: {
  url?: string | null;
  initials: string;
  uploading: boolean;
  onPick: () => void;
}) {
  return (
    <Pressable
      onPress={onPick}
      disabled={uploading}
      accessibilityRole="button"
      accessibilityLabel="Modifier la photo de profil"
      android_ripple={{ color: '#00000022', borderless: true }}
      style={{ width: 96, height: 96, justifyContent: 'center', alignItems: 'center' }}
    >
      <YStack w={96} h={96} position="relative" ai="center" jc="center">
        <Avatar circular size="$6" key={url || 'fallback'}>
          <Avatar.Image source={url ? { uri: url } : undefined} />
          <Avatar.Fallback bc="$color5" ai="center" jc="center" delayMs={100}>
            <SizableText size="$9" fow="600" col="$color10">
              {initials}
            </SizableText>
          </Avatar.Fallback>
        </Avatar>

        {/* overlay état */}
        {uploading ? (
          <YStack
            position="absolute"
            t={0}
            r={0}
            b={0}
            l={0}
            ai="center"
            jc="center"
            br="$12"
            //bg="rgba(0,0,0,0.25)"
          >
            <Spinner size="large" />
          </YStack>
        ) : (
          <XStack
            position="absolute"
            bottom={10}
            right={10}
            w={24}
            h={24}
            br={999}
            ai="center"
            jc="center"
            elevation="$2"
            bg="$background"
            borderWidth={1}
            borderColor="$borderColor"
            pointerEvents="none"
          >
            <Edit3 size={14} />
          </XStack>
        )}
      </YStack>
    </Pressable>
  );
}
