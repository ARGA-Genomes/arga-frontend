"use client";

import * as d3 from "d3";
import { Attribute, DataField } from "@/components/highlight-stack";
import { DataTable, DataTableRow } from "@/components/data-table";
import { TachoChart } from "@/components/graphing/tacho";
import { gql, useQuery } from "@apollo/client";
import {
  Grid,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Skeleton,
  Center,
  Box,
} from "@mantine/core";
import * as Humanize from "humanize-plus";
import { BarChart, CircularBarChart } from "@/components/graphing/bar";
import { LoadOverlay } from "@/components/load-overlay";
import { DonutChart } from "@/components/graphing/pie";
import { CircularPackingChart } from "@/components/graphing/circular-packing";
import { SunburstChart } from "@/components/graphing/sunburst";
import { useState } from "react";

const GET_TAXON = gql`
  query HomeStats {
    taxon(rank: DOMAIN, canonicalName: "Eukaryota") {
      summary {
        species
        speciesData
        speciesGenomes
      }

      speciesSummary {
        name
        genomes
        totalGenomic
      }

      speciesGenomeSummary {
        name
        genomes
        totalGenomic
      }

      kingdomDescendants: descendants(rank: KINGDOM) {
        canonicalName
        species
        speciesData
        speciesGenomes
      }

      superKingdomDescendants: descendants(rank: SUPERKINGDOM) {
        canonicalName
        species
        speciesData
        speciesGenomes
      }

      regnumDescendants: descendants(rank: REGNUM) {
        canonicalName
        species
        speciesData
        speciesGenomes
      }
    }
  }
`;

type DataBreakdown = {
  name: string;
  genomes: number;
  totalGenomic: number;
};

type Taxonomy = {
  dataSummary: DataBreakdown[];
  speciesSummary: DataBreakdown[];
  speciesGenomeSummary: DataBreakdown[];
  summary: {
    children: number;
    childrenData: number;
    childrenGenomes: number;
    species: number;
    speciesData: number;
    speciesGenomes: number;
  };
  kingdomDescendants: {
    canonicalName: string;
    species: number;
    speciesData: number;
    speciesGenomes: number;
  }[];
  superKingdomDescendants: {
    canonicalName: string;
    species: number;
    speciesData: number;
    speciesGenomes: number;
  }[];
  regnumDescendants: {
    canonicalName: string;
    species: number;
    speciesData: number;
    speciesGenomes: number;
  }[];
};

type TaxonResults = {
  taxon: Taxonomy;
};

const GET_DESCENDANTS = gql`
  query DescendantStats {
    eukaryotaTaxon: taxon(rank: DOMAIN, canonicalName: "Eukaryota") {
      canonicalName
      summary {
        species
      }
    }

    animaliaTaxon: taxon(rank: KINGDOM, canonicalName: "Animalia") {
      canonicalName
      summary {
        species
      }
      descendants(rank: PHYLUM) {
        canonicalName
        species
      }
    }

    protistaTaxon: taxon(rank: SUPERKINGDOM, canonicalName: "Protista") {
      canonicalName
      summary {
        species
      }
      descendants(rank: PHYLUM) {
        canonicalName
        species
      }
    }

    fungiTaxon: taxon(rank: REGNUM, canonicalName: "Fungi") {
      canonicalName
      summary {
        species
      }
      descendants(rank: DIVISION) {
        canonicalName
        species
      }
    }

    plantaeTaxon: taxon(rank: REGNUM, canonicalName: "Plantae") {
      canonicalName
      summary {
        species
      }
      descendants(rank: DIVISION) {
        canonicalName
        species
      }
    }

    chromistaTaxon: taxon(rank: REGNUM, canonicalName: "Chromista") {
      canonicalName
      summary {
        species
      }
      descendants(rank: DIVISION) {
        canonicalName
        species
      }
    }
  }
`;

type EukaryotaDescendantResults = {
  eukaryotaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
  };
  animaliaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  protistaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  fungiTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  plantaeTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  chromistaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
};

const GET_EUKARYOTA_TREE = gql`
  query TaxonHierarchy {
    animaliaTree: stats {
      taxonBreakdown(
        taxonRank: KINGDOM
        taxonCanonicalName: "Animalia"
        includeRanks: [PHYLUM, CLASS]
      ) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    plantaeTree: stats {
      taxonBreakdown(
        taxonRank: REGNUM
        taxonCanonicalName: "Plantae"
        includeRanks: [DIVISION, CLASSIS]
      ) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    fungiTree: stats {
      taxonBreakdown(
        taxonRank: REGNUM
        taxonCanonicalName: "Fungi"
        includeRanks: [DIVISION, CLASSIS]
      ) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    protistaTree: stats {
      taxonBreakdown(
        taxonRank: SUPERKINGDOM
        taxonCanonicalName: "Protista"
        includeRanks: [PHYLUM, CLASS]
      ) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    chromistaTree: stats {
      taxonBreakdown(
        taxonRank: REGNUM
        taxonCanonicalName: "Chromista"
        includeRanks: [DIVISION, CLASSIS]
      ) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }
  }
`;

type TaxonTreeNode = {
  name: string;
  rank: string;
  value?: number;
  children?: TaxonTreeNode[];
};

type EukaryotaTreeResults = {
  animaliaTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  plantaeTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  fungiTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  protistaTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  chromistaTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
};

export function ShowStats() {
  const taxonResults = useQuery<TaxonResults>(GET_TAXON);
  const taxon = taxonResults.data?.taxon;

  const thresholds = [
    { name: "low", color: "#f47625", start: 0, end: 50 },
    { name: "decent", color: "#febb1e", start: 50, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ];

  const speciesGenomes = taxon?.speciesGenomeSummary
    .filter((i) => i.genomes > 0)
    .map((summary) => {
      const linkName = encodeURIComponent(summary.name.replaceAll(" ", "_"));
      return {
        name: summary.name || "",
        value: summary.genomes,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  const genomePercentile =
    taxon && (taxon.summary.speciesGenomes / taxon.summary.species) * 100;

  return (
    <Paper radius="lg" style={{ top: 200, right: 0, width: 640 }}>
      <LoadOverlay visible={taxonResults.loading} />
      <Grid p={20}>
        <Grid.Col span={12}>
          <Title order={4}>Data summary</Title>
        </Grid.Col>
        <Grid.Col span={6} mb={10}>
          <Stack gap="sm">
            <Title order={6}>Percentage of species with genomes</Title>
            {taxon && (
              <TachoChart
                h={115}
                thresholds={thresholds}
                value={Math.round(genomePercentile || 0)}
              />
            )}
          </Stack>
        </Grid.Col>

        <Grid.Col span={6} mb={10}>
          <Stack gap="sm">
            <Title order={6}>Taxonomic breakdown</Title>

            <DataTable my={2}>
              <DataTableRow label="Number of species/OTUs">
                <DataField
                  value={Humanize.formatNumber(taxon?.summary.species || 0)}
                />
              </DataTableRow>

              <DataTableRow label="Species with genomes">
                <DataField
                  value={Humanize.formatNumber(
                    taxon?.summary.speciesGenomes || 0
                  )}
                />
              </DataTableRow>

              <DataTableRow label="Species with data">
                <DataField
                  value={Humanize.formatNumber(taxon?.summary.speciesData || 0)}
                />
              </DataTableRow>
            </DataTable>
          </Stack>
        </Grid.Col>

        <Grid.Col span={12} pt={10}>
          <Stack>
            <Title order={6}>Species with genomes</Title>
            {speciesGenomes && (
              <BarChart
                h={250}
                data={speciesGenomes.slice(0, 10)}
                spacing={0.1}
                labelWidth={200}
              />
            )}
          </Stack>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text fz={10} c="midnight.6">
            Note: these statistics summarise the content indexed within ARGA.
            The values relate to the species deemed relevant to Australia
            (either by endemicity or economic and social value), and for
            repositories that are indexed by ARGA. The values may not be
            indicative of global values for all research.
          </Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export function ShowTaxonomicCoverageStats() {
  const taxonResults = useQuery<TaxonResults>(GET_TAXON);
  if (taxonResults.error) return <p>Error : {taxonResults.error.message}</p>;

  const taxon = taxonResults.data?.taxon;

  // const domainData = [
  //   { name: "Archaea", value: 1, label: 0 },
  //   {
  //     name: "Eukaryota",
  //     value: 1,
  //     label: taxon?.summary.species,
  //     href: "/domain/Eukaryota",
  //   },
  //   { name: "Bacteria", value: 1, label: 0 },
  // ];

  // const kingdomRegnumData = taxon?.kingdomDescendants
  //   .map((descendant) => {
  //     return {
  //       name: descendant.canonicalName,
  //       value: 1,
  //       label: descendant.species,
  //       href: `/kingdom/${descendant.canonicalName}`,
  //     };
  //   })
  //   .concat(
  //     taxon?.regnumDescendants
  //       .filter((descendant) => descendant.canonicalName !== "Protista")
  //       .map((descendant) => {
  //         return {
  //           name: descendant.canonicalName,
  //           value: 1,
  //           label: descendant.species,
  //           href: `/regnum/${descendant.canonicalName}`,
  //         };
  //       })
  //   )
  //   .concat(
  //     taxon?.superKingdomDescendants.map((descendant) => {
  //       return {
  //         name: descendant.canonicalName,
  //         value: 1,
  //         label: descendant.species,
  //         href: `/superkingdom/${descendant.canonicalName}`,
  //       };
  //     })
  //   );

  const domainData = [
    { name: "Archaea", value: 1, label: 0 },
    {
      name: "Eukaryota",
      value: 1,
      label: taxon?.summary.species,
      href: "/domain/Eukaryota",
    },
    { name: "Bacteria", value: 1, label: 0 },
  ];

  const kingdomRegnumData = taxon?.kingdomDescendants
    .map((descendant) => {
      return {
        name: descendant.canonicalName,
        value: descendant.species,
        href: `/kingdom/${descendant.canonicalName}`,
      };
    })
    .concat(
      taxon?.regnumDescendants
        .filter((descendant) => descendant.canonicalName !== "Protista")
        .map((descendant) => {
          return {
            name: descendant.canonicalName,
            value: descendant.species,
            href: `/regnum/${descendant.canonicalName}`,
          };
        })
    )
    .concat(
      taxon?.superKingdomDescendants.map((descendant) => {
        return {
          name: descendant.canonicalName,
          value: descendant.species,
          href: `/superkingdom/${descendant.canonicalName}`,
        };
      })
    );

  return (
    // <Group gap={40} justify="center">
    //   <Stack>
    //     <Skeleton visible={taxonResults.loading}>
    //       <Center>
    //         <Title order={4} c="white">
    //           Domains
    //         </Title>
    //       </Center>
    //     </Skeleton>
    //     <Skeleton visible={taxonResults.loading} circle>
    //       <DonutChart h={375} w={375} data={domainData} labelled={true} />
    //     </Skeleton>
    //   </Stack>
    //   <Stack align="center">
    //     <Skeleton visible={taxonResults.loading}>
    //       <Center>
    //         <Title order={4} c="white">
    //           Kingdoms
    //         </Title>
    //       </Center>
    //     </Skeleton>
    //     {kingdomRegnumData && (
    //       <Skeleton visible={taxonResults.loading} circle h={375} w={375}>
    //         <DonutChart
    //           h={375}
    //           w={375}
    //           data={kingdomRegnumData}
    //           labelled={true}
    //         />
    //       </Skeleton>
    //     )}
    //   </Stack>
    // </Group>

    <Group gap={40} justify="center">
      <Stack>
        <Skeleton visible={taxonResults.loading}>
          <Center>
            <Title order={4} c="white">
              Domains
            </Title>
          </Center>
        </Skeleton>
        <Skeleton visible={taxonResults.loading} circle>
          <DonutChart h={350} w={350} data={domainData} labelled={true} />
        </Skeleton>
      </Stack>
      <Stack align="center">
        <Skeleton visible={taxonResults.loading}>
          <Center>
            <Title order={4} c="white">
              Kingdoms
            </Title>
          </Center>
        </Skeleton>
        {kingdomRegnumData && (
          <Skeleton visible={taxonResults.loading} circle h={375} w={375}>
            <CircularBarChart
              h={400}
              w={400}
              margin={30}
              data={kingdomRegnumData}
            />
          </Skeleton>
        )}
      </Stack>
    </Group>
  );
}

type TreeNode = {
  name: string;
  value?: number;
  color?: string;
  children?: TreeNode[];
};

export function ShowCircularTaxonomy() {
  const [treeData, setTreeData] = useState<TreeNode>();

  const { data, loading, error } = useQuery<EukaryotaDescendantResults>(
    GET_DESCENDANTS,
    {
      onCompleted: (data) => {
        const kingdomsRegnaTaxa = [
          data.animaliaTaxon,
          data.protistaTaxon,
          data.plantaeTaxon,
          data.fungiTaxon,
          data.chromistaTaxon,
        ];
        const tData: TreeNode = {
          name: data.eukaryotaTaxon.canonicalName,
          children: kingdomsRegnaTaxa.map((taxon) => {
            return {
              name: taxon.canonicalName,
              children: taxon.descendants.map((descendant) => {
                return {
                  name: descendant.canonicalName,
                  value: descendant.species,
                };
              }),
            };
          }),
        };
        // console.log(tData);
        setTreeData(tData);
      },
    }
  );

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <>
      {treeData && (
        // <CircularPacking data={treeData} width={1000} height={700} />

        <CircularPackingChart data={treeData} width={520} height={520} />
      )}
    </>
  );
}

export function ShowSunburstTaxonomy() {
  const [treeData, setTreeData] = useState<TaxonTreeNode>();

  const { data, loading, error } = useQuery<EukaryotaTreeResults>(
    GET_EUKARYOTA_TREE,
    {
      onCompleted: (data) => {
        const kingdomsRegnaTaxa = [
          {
            name: "Animalia",
            rank: "KINGDOM",
            children: data.animaliaTree.taxonBreakdown,
          },
          {
            name: "Plantae",
            rank: "REGNUM",
            children: data.plantaeTree.taxonBreakdown,
          },
          {
            name: "Fungi",
            rank: "REGNUM",
            children: data.fungiTree.taxonBreakdown,
          },
          {
            name: "Protista",
            rank: "SUPERKINGDOM",
            children: data.protistaTree.taxonBreakdown,
          },
          {
            name: "Chromista",
            rank: "REGNUM",
            children: data.chromistaTree.taxonBreakdown,
          },
        ];
        const tData: TaxonTreeNode = {
          name: "Eukaryota",
          rank: "DOMAIN",
          children: kingdomsRegnaTaxa,
        };
        setTreeData(tData);
      },
    }
  );

  return (
    <Skeleton visible={loading} circle>
      {treeData && <SunburstChart data={treeData} width={520} height={520} />}
    </Skeleton>
  );
}
