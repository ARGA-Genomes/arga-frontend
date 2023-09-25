"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Paper,
  Title,
  Box,
  Text,
  Card,
  SimpleGrid,
  Stack,
  Grid,
  Image,
  Container,
  Table,
  Group,
  SegmentedControl,
  Drawer,
  Button,
  Badge,
} from "@mantine/core";

import Link from "next/link";
import { CircleCheck, CircleX, X as IconX, Filter as IconFilter, SortAscending } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { LoadOverlay, LoadPanel } from "@/app/components/load-overlay";
import { Filter, intoFilterItem } from "@/app/components/filtering/common";
import ClassificationHeader from "@/app/components/classification-header";
import { MAX_WIDTH } from "@/app/constants";
import { PaginationBar } from "@/app/components/pagination";
import { AttributeLink, DataField } from "@/app/components/highlight-stack";
import { useTableStyles } from "@/app/components/data-fields";
import { useDisclosure } from "@mantine/hooks";
import { HigherClassificationFilters } from "@/app/components/filtering/higher-classification";
import { VernacularGroupFilters } from "@/app/components/filtering/vernacular-group";
import { EcologyFilters } from "@/app/components/filtering/ecology";
import { IbraFilters } from "@/app/components/filtering/ibra";
import { ImcraFilters } from "@/app/components/filtering/imcra";
import { StateFilters } from "@/app/components/filtering/state";
import { DrainageBasinFilters } from "@/app/components/filtering/drainage-basin";


const PAGE_SIZE = 10;


type Filters = {
  classifications: Filter[],
  vernacularGroup?: Filter,
  ecology?: Filter,
  ibra?: Filter,
  imcra?: Filter,
  state?: Filter,
  drainageBasin?: Filter,
}


const GET_SPECIES = gql`
query TaxaSpecies($page: Int, $perPage: Int, $filters: [FilterItem]) {
  taxa(filters: $filters) {
    species(page: $page, perPage: $perPage) {
      total,
      records {
        taxonomy { canonicalName }
        photo { url }
        dataSummary {
          wholeGenomes
          partialGenomes
          organelles
          barcodes
          other
        }
      }
    }
    filterOptions {
      ecology
      ibra
      imcra
      state
      drainageBasin
    }
  }
}`;


const GET_TAXON = gql`
query TaxaSpecies($rank: TaxonRank, $canonicalName: String) {
  taxon(rank: $rank, canonicalName: $canonicalName) {
    scientificName
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
  }
}`;

type Taxonomy = {
  scientificName: string,
  canonicalName: string,
  authority?: string,
  status?: string,
  kingdom?: string,
  phylum?: string,
  class?: string,
  order?: string,
  family?: string,
  genus?: string,
  vernacularGroup?: string,
};

type DataSummary = {
  wholeGenomes: number,
  organelles: number,
  barcodes: number,
  other: number,
}

type Species = {
  taxonomy: { canonicalName: string },
  photo: { url: string },
  dataSummary: DataSummary,
}

type FilterOptions = {
  ecology: string[],
  ibra: string[],
  imcra: string[],
  state: string[],
  drainageBasin: string[],
}

type Taxa = {
  species: {
    records: Species[],
    total: number,
  },
  filterOptions: FilterOptions,
};

type QueryResults = {
  taxa: Taxa,
};

type TaxonResults = {
  taxon: Taxonomy,
}


function DataItem({ name, count }: { name: string; count: number }) {
  const hasData = count > 0;
  const dimmed = "rgba(134, 142, 150, .5)";
  const extraDimmed = "rgba(134, 142, 150, .3)";

  return (
    <Grid>
      <Grid.Col span="content" pb={0} pr={0} mr={0}>
        {hasData ? (
          <CircleCheck color="green" />
        ) : (
          <CircleX color={extraDimmed} />
        )}
      </Grid.Col>
      <Grid.Col span="auto">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400}>
          {name}
        </Text>
      </Grid.Col>
      <Grid.Col span="content">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400}>
          {count} records
        </Text>
      </Grid.Col>
    </Grid>
  );
}

function SpeciesCard({ species }: { species: Species }) {
  const itemLinkName = species.taxonomy.canonicalName?.replaceAll(" ", "_");

  function small(photo: { url: string }) {
    return photo.url.replaceAll("original", "small");
  }

  return (
    <Card shadow="sm" p={20} radius="lg" withBorder>
      <Link href={`/species/${itemLinkName}/taxonomy`}>
        <Title order={4}>{species.taxonomy.canonicalName}</Title>
      </Link>

      <Box py={20}>
        <DataItem name="Genomes" count={species.dataSummary.wholeGenomes} />
        <DataItem name="Genetic Loci*" count={species.dataSummary.barcodes} />
        <DataItem name="Other" count={species.dataSummary.other} />
      </Box>

      <Card.Section>
        <Link href={`/species/${itemLinkName}/taxonomy`}>
          {species.photo ? (
            <Image
              src={small(species.photo)}
              height={160}
              alt={species.taxonomy.canonicalName}
            />
          ) : (
            <Image
              withPlaceholder
              height={160}
              alt={species.taxonomy.canonicalName}
            />
          )}
        </Link>
      </Card.Section>
    </Card>
  );
}

const speciesTotalRecords = (species: Species) => {
  return (
    species.dataSummary.wholeGenomes +
    species.dataSummary.organelles +
    species.dataSummary.barcodes +
    species.dataSummary.other
  );
};


function TaxonomyDetails({ taxon }: { taxon: Taxonomy | undefined }) {
  const { classes } = useTableStyles();

  return (
    <Table className={classes.simpleTable}>
      <tbody>
      <tr>
        <td>Scientific name</td>
        <td><DataField value={undefined}/></td>
      </tr>
      <tr>
        <td>Status</td>
        <td><DataField value={undefined}/></td>
      </tr>
      <tr>
        <td>Source</td>
        <td><DataField value={undefined}/></td>
      </tr>
      </tbody>
    </Table>
  )
}

function HigherClassification({ taxon }: { taxon: Taxonomy | undefined }) {
  return (
    <Group>
      { taxon?.kingdom && <AttributeLink label="Kingdom" value={taxon?.kingdom} href={`/kingdom/${taxon?.kingdom}`} /> }
      { taxon?.phylum && <AttributeLink label="Phylum" value={taxon?.phylum} href={`/phylum/${taxon?.phylum}`} />  }
      { taxon?.class && <AttributeLink label="Class" value={taxon?.class} href={`/class/${taxon?.class}`} /> }
      { taxon?.order && <AttributeLink label="Order" value={taxon?.order} href={`/order/${taxon?.order}`} /> }
      { taxon?.family && <AttributeLink label="Family" value={taxon?.family} href={`/family/${taxon?.family}`} /> }
      { taxon?.genus && <AttributeLink label="Genus" value={taxon?.genus} href={`/genus/${taxon?.genus}`} /> }
    </Group>
  )
}


interface FiltersProps {
  filters: Filters,
  options?: FilterOptions,
  onChange: (filters: Filters) => void,
}

function Filters({ filters, options, onChange }: FiltersProps) {
  const [classifications, setClassifications] = useState<Filter[]>(filters.classifications)
  const [vernacularGroup, setVernacularGroup] = useState<Filter | undefined>(filters.vernacularGroup)
  const [ecology, setEcology] = useState<Filter | undefined>(filters.ecology)
  const [ibra, setIbra] = useState<Filter | undefined>(filters.ibra)
  const [imcra, setImcra] = useState<Filter | undefined>(filters.imcra)
  const [state, setState] = useState<Filter | undefined>(filters.state)
  const [drainageBasin, setDrainageBasin] = useState<Filter | undefined>(filters.drainageBasin)

  useEffect(() => {
    onChange({
      classifications,
      vernacularGroup,
      ecology,
      ibra,
      imcra,
      state,
      drainageBasin,
    })
  }, [classifications, vernacularGroup, ecology, ibra, imcra, state, drainageBasin, onChange]);

  return (
    <Stack p={20}>
      <Title order={5}>Higher classification</Title>
      <HigherClassificationFilters
        filters={classifications}
        onChange={setClassifications}
      />

      <Title order={5}>Vernacular group</Title>
      <VernacularGroupFilters value={vernacularGroup?.value} onChange={setVernacularGroup} />

      <Title order={5}>Ecology</Title>
      <EcologyFilters value={ecology?.value} options={options?.ecology || []} onChange={setEcology} />

      <Title order={5}>Ibra Region</Title>
      <IbraFilters value={ibra?.value} options={options?.ibra || []} onChange={setIbra} />

      <Title order={5}>Imcra Region</Title>
      <ImcraFilters value={imcra?.value} options={options?.imcra || []} onChange={setImcra} />

      <Title order={5}>State</Title>
      <StateFilters value={state?.value} options={options?.state || []} onChange={setState} />

      <Title order={5}>Drainage Basin</Title>
      <DrainageBasinFilters value={drainageBasin?.value} options={options?.drainageBasin || []} onChange={setDrainageBasin} />
    </Stack>
  )
}


function FilterBadge({ filter }: { filter: Filter }) {
  return (
    <Badge variant="outline">
      {filter.value}
    </Badge>
  )
}


function Species({ rank, canonicalName }: { rank: string, canonicalName: string }) {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const [filters, setFilters] = useState<Filters>({
    classifications: [{ filter: rank, action: "INCLUDE", value: canonicalName, editable: false }],
  });

  const flattenFilters = (filters: Filters) => {
    const items = [
      ...filters.classifications,
      filters.vernacularGroup,
      filters.ecology,
      filters.ibra,
      filters.imcra,
      filters.state,
      filters.drainageBasin,
    ];

    return items.filter((item): item is Filter => !!item);
  }

  const { loading, error, data, previousData } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      page,
      perPage: PAGE_SIZE,
      filters: flattenFilters(filters).map(intoFilterItem).filter(item => item)
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  const records = data?.taxa.species.records || previousData?.taxa.species.records;

  return (
    <Stack>
      <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="xl">
        <Box mt={200}>
          <Filters filters={filters} options={data?.taxa.filterOptions} onChange={setFilters} />
        </Box>
      </Drawer>

      <LoadOverlay visible={loading} />

      <Grid gutter={50} align="baseline">
        <Grid.Col span="content">
          <Title order={5}>Browse species</Title>
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            <Text fz="sm" weight={300}>Filters</Text>
            { flattenFilters(filters).map(filter => <FilterBadge filter={filter} key={filter.value} />) }
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Group noWrap>
            <SortAscending />
            <Text>Sort by</Text>
            <SegmentedControl radius="xl" data={[
              { value: 'alpha', label: 'A-Z' },
              { value: 'date', label: 'Date' },
              { value: 'records', label: 'Records' },
            ]}/>
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Button leftIcon={<IconFilter />} variant="subtle" onClick={open}>Filter</Button>
        </Grid.Col>
      </Grid>

      <SimpleGrid cols={5} pt={40}>
        {records?.map(record => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar
        total={data?.taxa.species.total}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </Stack>


  );
}


export default function ClassificationPage({ params }: { params: { rank: string, name: string } }) {
  const rank = params.rank.toUpperCase();

  const taxonResults = useQuery<TaxonResults>(GET_TAXON, {
    variables: {
      rank,
      canonicalName: params.name
    },
  });

  return (
    <Stack>
          {/* {taxonomy && <Header kingdom={taxonomy.kingdom || params.name} />} */}
      <ClassificationHeader rank={rank} classification={params.name} />

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Grid>
              <Grid.Col span={3}>
                <LoadPanel visible={taxonResults.loading} h={180}>
                  <Title pb={10} order={5}>Taxonomy</Title>
                  <TaxonomyDetails taxon={taxonResults.data?.taxon}/>
                </LoadPanel>
              </Grid.Col>
              <Grid.Col span={9}>
                <LoadPanel visible={taxonResults.loading} h={180}>
                  <Title pb={10} order={5}>Higher classification</Title>
                  <HigherClassification taxon={taxonResults.data?.taxon}/>
                </LoadPanel>
              </Grid.Col>
            </Grid>

            <Paper p="xl" radius="lg" pos="relative" withBorder>
              <Species rank={rank} canonicalName={params.name} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
