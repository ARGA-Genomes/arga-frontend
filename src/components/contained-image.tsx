import { Maybe, SpeciesPhoto } from "@/generated/types";
import { getLicense } from "@/helpers/getLicense";
import {
  Box,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  MantineStyleProp,
  Overlay,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { CCIcon } from "./cc-icon";

interface ContainedImageProps {
  photo: Maybe<SpeciesPhoto>;
  style?: MantineStyleProp;
}

export function ContainedImage({ photo, style }: ContainedImageProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const height = "100%";

  const src = photo?.url.replace("original", "medium");
  const license = photo?.license ? getLicense(photo.license) : null;

  console.log(license?.icons, license?.url);

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
            style={{ zIndex: 200, bottom: 0, left: 0, right: 0 }}
          >
            <Stack
              py={5}
              px={15}
              style={{
                backgroundColor: "rgba(28,48,60,0.4)",
                backdropFilter: "blur(12px)",
                width: "100%",
              }}
              gap={4}
            >
              <Group gap="xs" justify="space-between">
                <Group gap="xs">
                  <Text fw="bold" c="white" fz="xs">
                    &copy; {photo.rightsHolder}
                  </Text>
                  <Text
                    c="white"
                    component={photo.source ? Link : undefined}
                    href={photo.source || "#"}
                    target="_blank"
                    fz="xs"
                  >
                    {photo.publisher}
                  </Text>
                </Group>
                {license && (
                  <Tooltip
                    zIndex={1000}
                    radius="md"
                    label={
                      <Text size="xs" fw="bold">
                        {license.name}
                      </Text>
                    }
                  >
                    <Link href={license.url} target="_blank">
                      <Group gap="xs">
                        {license.icons.map((icon) => (
                          <CCIcon key={icon} type={icon} colour="white" size={18} style={{ opacity: 0.6 }} />
                        ))}
                      </Group>
                    </Link>
                  </Tooltip>
                )}
              </Group>
            </Stack>
          </Flex>
        </>
      ) : (
        <Center bg="#a6c0cf" style={{ overflow: "hidden", height: "100%" }}>
          <Image w={250} h={250} src="/no-image.png"></Image>
        </Center>
      )}
    </Box>
  );
}
