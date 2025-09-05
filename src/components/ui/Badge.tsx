import { XStack, Paragraph } from 'tamagui';

export function Badge({
  children,
  color = '$color',
  bg = '$backgroundPress',
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <XStack px="$2" py="$1" br="$4" ai="center" jc="center" bc={bg}>
      <Paragraph size="$2" fow="600" col={color}>
        {children}
      </Paragraph>
    </XStack>
  );
}
