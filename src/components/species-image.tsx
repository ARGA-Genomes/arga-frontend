"use client";

import {
    Center,
  Image,
  ImageProps,
} from "@mantine/core";


function placeholder(kingdom: string | undefined) {
  switch(kingdom) {
      case 'Animalia':
      return '/card-icons/taxon/animals.svg';
      case 'Plantae':
      return '/card-icons/taxon/plants.svg';
      case 'Fungi':
      return '/card-icons/taxon/fungi.svg';
      case 'Protista':
      return '/card-icons/taxon/protista.svg';
      case 'Bacteria':
      return '/card-icons/taxon/bacteria.svg';
      default:
      return '/placeholder-generic.jpg';
  }
}


interface PlaceholderImageProps extends ImageProps {
  taxonomy?: {
    canonicalName?: string,
    kingdom?: string
  },
}

function Placeholder({ taxonomy, ...imageProps }: PlaceholderImageProps) {
  return (
    <Center>
      <Image
        src={placeholder(taxonomy?.kingdom)}
        alt={taxonomy?.canonicalName}
        fit="contain"
        {...imageProps}
      />
    </Center>
  );
}


interface SpeciesPhotoProps extends ImageProps {
  photo: { url: string },
}

function Photo({ photo, ...imageProps }: SpeciesPhotoProps) {
  const url = photo.url.replace("original", "medium");

  return (
    <Image
      src={url}
      {...imageProps}
    />
  );
}


interface SpeciesImageProps extends ImageProps {
  photo?: { url: string },
  taxonomy?: {
    canonicalName?: string,
    kingdom?: string,
  },
}

export function SpeciesImage({ photo, taxonomy, ...imageProps }: SpeciesImageProps) {
  return (
    <>
    { photo
      ? <Photo photo={photo} {...imageProps} />
      : <Placeholder taxonomy={taxonomy} {...imageProps} />
    }
    </>
  );
}
