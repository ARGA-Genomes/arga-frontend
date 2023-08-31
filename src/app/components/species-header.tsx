'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Button, createStyles, Grid, Group, LoadingOverlay, Paper, Stack, Text, Title } from "@mantine/core";
import { Conservation, IndigenousEcologicalKnowledge, Taxonomy } from "@/app/type";
import IconBar from "./icon-bar";
import Link from "next/link";
import { useState } from "react";


const GET_SPECIES = gql`
query SpeciesWithConservation($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    taxonomy {
      canonicalName
      authority
      status
      kingdom
      phylum
      class
      order
      family
      genus
      vernacularGroup
      vernacularNames {
        name
      }
      synonyms {
        scientificName
      }
    }
    conservation {
      status
      state
      source
    }
    indigenousEcologicalKnowledge {
      id
      name
      datasetName
      culturalConnection
      foodUse
      medicinalUse
      sourceUrl
    }
  }
}`;

type QueryResults = {
  species: {
    taxonomy: Taxonomy,
    conservation: Conservation[],
    indigenousEcologicalKnowledge: IndigenousEcologicalKnowledge[],
  },
};


interface HeaderProps {
  taxonomy: Taxonomy,
  conservation?: Conservation[],
  traits?: IndigenousEcologicalKnowledge[],
}

function taxonomicStatusColors(taxonomyStatus: string) {
  const { classes } = useSpeciesHeaderStyles();
  if (taxonomyStatus === 'valid' || taxonomyStatus === 'accepted') {
    return 'successGreen.0'
  }
  else if (taxonomyStatus === 'invalid' || taxonomyStatus === 'not accepted') {
    return 'red'
  }
  return 'gray'
}
function getVernacularNames (names: { name: string }[]) {
  let vernacularNames = names.map(function(name) {
    return name['name']
  })
  return vernacularNames.join(", ")
}

function Attribution({ name, url }: { name: string; url: string }) {
  return (
    <Text color="gray" weight="bold">
      Source:{" "}
      <Link href={url} target="_blank">
        {name}
      </Link>
    </Text>
  );
}

function Header({ taxonomy, conservation, traits }: HeaderProps) {
  const attribution = "Australian Faunal Directory";
  const sourceUrl = `https://biodiversity.org.au/afd/taxa/${taxonomy.canonicalName}`;
  const { classes } = useSpeciesHeaderStyles();
  const [fullCommonNames, setFullCommonNames] = useState(false);


  return (
    <Grid>
      <Grid.Col span="auto">
        <Stack justify="center" h="100%" spacing={0}>
          <Title order={3} size={26}>
            <i>{taxonomy.canonicalName}</i> {taxonomy.authority}
          </Title>
          <Text color="gray" mt={-8} size="sm">
            <Group><b>Taxonomic Status: </b> <Text color={taxonomicStatusColors(taxonomy.status.toLowerCase())}>{taxonomy.status.toLowerCase()}</Text></Group>
            <Attribution name={attribution} url={sourceUrl} />
          </Text>
          <Group>
            <Text color="gray" size="sm" className = {classes.commonNameHeader}><b>Common names: </b></Text>
            { taxonomy.vernacularNames && taxonomy.vernacularNames.length > 0
              ? <>
                  <Text size="sm" weight={550} className={fullCommonNames ? classes.commonNames : classes.ellipsedCommonNames}>{getVernacularNames(taxonomy.vernacularNames)}</Text>
                  <Button className= {classes.showMoreButton} onClick={() => setFullCommonNames((prevDisplay) => !prevDisplay)}> {fullCommonNames ? "Show Less" : "Show More"} </Button>
                </>
              : <Text size="sm" weight={550} c="dimmed">None</Text>
            }
          </Group>
        
        </Stack>
      </Grid.Col>
      <Grid.Col span="content" className={classes.traits}>
        <Stack h="100%" justify="center">
          <IconBar taxonomy={taxonomy} conservation={conservation} traits={traits} />
        </Stack>
      </Grid.Col>
    </Grid>
  )
}


export default function SpeciesHeader({ canonicalName }: { canonicalName: string }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
        canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }
  
  const taxonomy = data?.species.taxonomy;
  const conservation = data?.species.conservation;
  const traits = data?.species.indigenousEcologicalKnowledge;

  return (
    <Box pos="relative">
      <Paper radius="lg" p={20}>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />
      { taxonomy ? <Header taxonomy={taxonomy} conservation={conservation} traits={traits} /> : null }
      </Paper>
    </Box>
  )
}

const useSpeciesHeaderStyles = createStyles((theme, _params, _getRef) => {
  return {
    ellipsedCommonNames: {
      width: '300px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginRight: '-10px'
    },
    commonNames: {
      width: '300px',
      overflow: 'inherit',
      textAlign: 'justify',
      marginRight: '-10px'
    },
    commonNameHeader: {
      marginBottom: 'auto'
    },
    showMoreButton: {
      border: 'none',
      background: 'none',
      color: theme.colors.link,
      textDecoration: 'underline',
      paddingLeft: '0px',
      marginTop: '-1px',
      height: 'inherit',
      font: 'inherit',
      marginBottom: 'auto',
      '&:hover, &:focus': {
        background: 'none'
      }
    },
    traits: {
      marginBottom: 'auto'
    }
  }
});
