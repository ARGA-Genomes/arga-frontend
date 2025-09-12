import { Box, Image, Loader, Overlay } from "@mantine/core";
import { useState } from "react";

interface ContainedImageProps {
  src: string;
  h?: string | number;
}

export function ContainedImage({ src, h }: ContainedImageProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const height = h ?? "100%";

  return (
    <Box pos="relative" h={height}>
      <Image pos="absolute" src={src} height={height} />
      <Overlay blur={8} opacity={0.1} center>
        <Image src={src} height={350} fit="contain" styles={{ root: { margin: 0 } }} onLoad={() => setLoaded(true)} />
      </Overlay>
      {!loaded && (
        <Overlay opacity={0.4} center>
          <Loader />
        </Overlay>
      )}
    </Box>
  );
}
