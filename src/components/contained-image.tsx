import { Maybe, SpeciesPhoto } from "@/generated/types";
import { Box, Center, Flex, Group, Image, Loader, MantineStyleProp, Overlay, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

interface ContainedImageProps {
  photo: Maybe<SpeciesPhoto>;
  h?: string | number;
  style?: MantineStyleProp;
}

export function ContainedImage({ photo, h, style }: ContainedImageProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const height = h ?? "100%";

  const src = photo?.url.replace("original", "medium");

  return (
    <Box pos="relative" h={height} style={{ borderRadius: "var(--mantine-radius-lg)", ...(style || {}) }}>
      {photo ? (
        <>
          <Image pos="absolute" src={src} height={height} />
          <Overlay blur={8} backgroundOpacity={0.3} color="#ffffff" center>
            <Image
              src={src}
              height={height}
              fit="contain"
              styles={{ root: { margin: 0 } }}
              onLoad={() => setLoaded(true)}
            />
          </Overlay>
          {!loaded && (
            <Overlay opacity={0.4} center>
              <Loader />
            </Overlay>
          )}
          <Flex
            pos="absolute"
            align="flex-end"
            w="inherit"
            h="inherit"
            style={{ zIndex: 1000, bottom: 0, left: 0, marginRight: 10 }}
          >
            <Stack gap="xs">
              <Group
                py={5}
                px={15}
                style={{ borderTopRightRadius: 14, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}
              >
                <Text c="white" fz="xs">
                  &copy; {photo.rightsHolder}
                </Text>
                <Text fz="xs">
                  {photo!.source ? (
                    <Link href={photo.source || "#"} target="_blank">
                      {photo.publisher}
                    </Link>
                  ) : (
                    photo.publisher
                  )}
                </Text>
              </Group>
              <Text fz="xs">{photo.license}</Text>
            </Stack>
          </Flex>
        </>
      ) : (
        <Center style={{ overflow: "hidden", height: "100%" }}>
          <Image w={250} h={250} src="/no-image.png"></Image>
        </Center>
      )}
    </Box>
  );
}
