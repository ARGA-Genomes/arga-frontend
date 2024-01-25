"use client";

import * as Humanize from 'humanize-plus';
import { gql, useQuery } from "@apollo/client";
import {
  Paper,
  Title,
  Box,
  Text,
  SimpleGrid,
  Stack,
  Grid,
  Container,
  Table,
  Group,
  SegmentedControl,
  Drawer,
  Button,
  Badge,
  Accordion,
  Avatar,
} from "@mantine/core";

import { Filter as IconFilter, SortAscending } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { LoadOverlay, LoadPanel } from "@/components/load-overlay";
import { Filter, intoFilterItem } from "@/components/filtering/common";
import ClassificationHeader from "@/components/classification-header";
import { MAX_WIDTH } from "@/app/constants";
import { PaginationBar } from "@/components/pagination";
import { Attribute, DataField } from "@/components/highlight-stack";
import { useDisclosure } from "@mantine/hooks";
import { HigherClassificationFilters } from "@/components/filtering/higher-classification";
import { VernacularGroupFilters } from "@/components/filtering/vernacular-group";
import { EcologyFilters } from "@/components/filtering/ecology";
import { IbraFilters } from "@/components/filtering/ibra";
import { ImcraFilters } from "@/components/filtering/imcra";
import { StateFilters } from "@/components/filtering/state";
import { DrainageBasinFilters } from "@/components/filtering/drainage-basin";
import { TachoChart } from "@/components/graphing/tacho";
import { PieChart } from "@/components/graphing/pie";
import { BarChart } from "@/components/graphing/bar";
import { BushfireRecoveryFilters } from '@/components/filtering/bushfire-recovery';
import { DataTable, DataTableRow } from '@/components/data-table';
import { SpeciesCard } from '@/components/species-card';
import { usePreviousPage } from '@/components/navigation-history';
import { usePathname } from 'next/navigation';
import { HasDataFilters } from '@/components/filtering/has-data';


const PAGE_SIZE = 10;


type Filters = {
  classifications: Filter[],
  vernacularGroup?: Filter,
  ecology?: Filter,
  ibra?: Filter,
  imcra?: Filter,
  state?: Filter,
  drainageBasin?: Filter,
  bushfireRecovery: Filter[],
  dataTypes: Filter[],
}


const GET_SPECIES = gql`
query TaxaSpecies($page: Int, $perPage: Int, $filters: [FilterItem]) {
  taxa(filters: $filters) {
    species(page: $page, perPage: $perPage) {
      total,
      records {
        taxonomy {
          canonicalName
        }
        photo {
          url
          publisher
          license
          rightsHolder
        }
        dataSummary {
          genomes
          loci
          specimens
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
query TaxonDetails($rank: TaxonRank, $canonicalName: String, $descendantRank: TaxonRank) {
  taxon(rank: $rank, canonicalName: $canonicalName) {
    scientificName
    canonicalName
    authorship
    status
    nomenclaturalCode
    citation
    source
    sourceUrl

    hierarchy {
      scientificName
      canonicalName
      rank
      depth
    }

    descendants(rank: $descendantRank) {
      canonicalName
      species
      speciesData
      speciesGenomes
    }

    summary {
      species
      speciesData
      speciesGenomes
    }

    dataSummary {
      name
      genomes
      totalGenomic
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
  }
}`;

type DataBreakdown = {
  name: string,
  genomes: number,
  totalGenomic: number,
}

type ClassificationNode = {
  scientificName: string,
  canonicalName: string,
  rank: string,
  depth: number,
}

type Taxonomy = {
  scientificName: string,
  scientificNameAuthorship: string,
  canonicalName: string,
  status: string,
  nomenclaturalCode: string,
  citation: string,
  hierarchy: ClassificationNode[],
  dataSummary: DataBreakdown[]
  speciesSummary: DataBreakdown[]
  speciesGenomeSummary: DataBreakdown[]
  summary: {
    species: number,
    speciesData: number,
    speciesGenomes: number,
  }
  descendants: {
    canonicalName: string,
    species: number,
    speciesData: number,
    speciesGenomes: number,
  }[]
};

type DataSummary = {
  genomes: number,
  loci: number,
  specimens: number,
  other: number,
}

type Species = {
  taxonomy: {
    canonicalName: string,
  }[],
  photo?: { url: string },
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


function TaxonomyDetails({ taxon }: { taxon: Taxonomy | undefined }) {
  return (
    <Table>
      <tbody>
      <tr>
        <td>Scientific name</td>
        <td><DataField value={taxon?.scientificName}/></td>
      </tr>
      <tr>
        <td>Status</td>
        <td><DataField value={taxon?.status.toLocaleLowerCase()}/></td>
      </tr>
      <tr>
        <td>Source</td>
        <td><DataField value={taxon?.citation}/></td>
      </tr>
      </tbody>
    </Table>
  )
}

function HigherClassification({ taxon }: { taxon: Taxonomy | undefined }) {
  const hierarchy = taxon?.hierarchy.toSorted((a, b) => b.depth - a.depth);

  return (
    <Group>
      { hierarchy?.map((node, idx) => (
        <Attribute
          key={idx}
          label={Humanize.capitalize(node.rank.toLowerCase())}
          value={node.canonicalName}
          href={`/${node.rank.toLowerCase() }/${node.canonicalName}`}
        />
      )) }
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
  const [bushfireRecovery, setBushfireRecovery] = useState<Filter[]>(filters.bushfireRecovery)
  const [dataTypes, setDataTypes] = useState<Filter[]>(filters.dataTypes)

  useEffect(() => {
    onChange({
      classifications,
      vernacularGroup,
      ecology,
      ibra,
      imcra,
      state,
      drainageBasin,
      bushfireRecovery,
      dataTypes,
    })
  }, [classifications, vernacularGroup, ecology, ibra, imcra, state, drainageBasin, bushfireRecovery, dataTypes, onChange]);

  return (
    <Accordion defaultValue="classification" variant='separated'>
      <Accordion.Item value="classification">
        <Accordion.Control>
          <FilterGroup
            label="Higher classification filters"
            description="Limit data based on taxonomy"
            image="/card-icons/type/higher_taxon_report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HigherClassificationFilters filters={classifications} onChange={setClassifications} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="hasData">
        <Accordion.Control>
          <FilterGroup
            label="Data types"
            description="Only show species that have specific types of data"
            image="/card-icons/type/whole_genomes.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HasDataFilters filters={dataTypes} onChange={setDataTypes} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="vernacular">
        <Accordion.Control>
          <FilterGroup
            label="Vernacular group"
            description="Birds, Flowering plants, Bacteria, etc."
            image="/card-icons/type/species_report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <VernacularGroupFilters value={vernacularGroup?.value} onChange={setVernacularGroup} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="regions">
        <Accordion.Control>
          <FilterGroup
            label="Regions"
            description="Ecological and administrative boundaries"
            image="/card-icons/dataset/terrestrial.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
          <Box>
            <Text fw={300} fz="sm">Ecology</Text>
            <EcologyFilters value={ecology?.value} options={options?.ecology || []} onChange={setEcology} />
          </Box>
          <Box>
            <Text fw={300} fz="sm">Ibra Region</Text>
            <IbraFilters value={ibra?.value} options={options?.ibra || []} onChange={setIbra} />
          </Box>
          <Box>
            <Text fw={300} fz="sm">Imcra Region</Text>
            <ImcraFilters value={imcra?.value} options={options?.imcra || []} onChange={setImcra} />
          </Box>
          <Box>
            <Text fw={300} fz="sm">State</Text>
            <StateFilters value={state?.value} options={options?.state || []} onChange={setState} />
          </Box>
          <Box>
            <Text fw={300} fz="sm">Drainage Basin</Text>
            <DrainageBasinFilters value={drainageBasin?.value} options={options?.drainageBasin || []} onChange={setDrainageBasin} />
          </Box>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="bushfire">
        <Accordion.Control>
          <FilterGroup
            label="Bushfire traits"
            description="Bushfire vulnerability and recovery"
            image="/card-icons/dataset/fire_vulnerable.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <BushfireRecoveryFilters filters={bushfireRecovery} onChange={setBushfireRecovery} />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

interface FilterGroupProps {
  label: string,
  description: string,
  image: string,
}

function FilterGroup({ label, description, image }: FilterGroupProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400} lineClamp={1}>
          {description}
        </Text>
      </div>
    </Group>
  )
}


function FilterBadge({ filter }: { filter: Filter }) {
  return (
    <Badge variant="outline" color="shellfish.7">
      {filter.value}
    </Badge>
  )
}


function Species({ rank, canonicalName }: { rank: string, canonicalName: string }) {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const [filters, setFilters] = useState<Filters>({
    classifications: [{ filter: rank, action: "INCLUDE", value: canonicalName, editable: false }],
    bushfireRecovery: [],
    dataTypes: [],
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
      ...filters.bushfireRecovery,
      ...filters.dataTypes,
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
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        size="xl"
      >
        <Box pt={200}>
          <Filters filters={filters} options={data?.taxa.filterOptions} onChange={setFilters} />
        </Box>
      </Drawer>

      <LoadOverlay visible={loading} />

      <Grid gutter={50} align="baseline">
        <Grid.Col span="content">
          <Group>
            <Title order={5}>Browse species</Title>
            <Text fz="sm" fw={300}>({data?.taxa.species.total} results)</Text>
          </Group>
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            <Text fz="sm" fw={300}>Filters</Text>
            { flattenFilters(filters).map(filter => <FilterBadge filter={filter} key={filter.value} />) }
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Group wrap="nowrap">
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
          <Button leftSection={<IconFilter />} variant="subtle" onClick={open} color="shellfish.7">Filter</Button>
        </Grid.Col>
      </Grid>

      <SimpleGrid cols={5} pt={40}>
        {records?.map(record => (
          <SpeciesCard key={record.taxonomy[0]?.canonicalName} species={record} />
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


const CLASSIFICATIONS_CHILD_MAP: Record<string, string> = {
    DOMAIN: 'kingdom',
    SUPERKINGDOM: 'kingdom',
    KINGDOM: 'phylum',
    SUBKINGDOM: 'phylum',
    PHYLUM: 'class',
    SUBPHYLUM: 'class',
    SUPERCLASS: 'class',
    CLASS: 'order',
    SUBCLASS: 'order',
    INFRACLASS: 'order',
    SUPERORDER: 'order',
    ORDER: 'family',
    SUBORDER: 'family',
    INFRAORDER: 'family',
    SUPERFAMILY: 'family',
    FAMILY: 'genus',
    SUBFAMILY: 'genus',
    SUPERTRIBE: 'genus',
    TRIBE: 'genus',
    SUBTRIBE: 'genus',
    GENUS: 'species',
    SUBGENUS: 'species',
    SPECIES: 'subspecies',
    SUBSPECIES: 'subspecies',

    UNRANKED: 'unranked',
    HIGHERTAXON: 'higher taxon',

    AGGREGATEGENERA: 'aggregate genera',
    AGGREGATESPECIES: 'aggregate species',
    INCERTAESEDIS: 'incertae sedis',

    REGNUM: 'division',
    DIVISION: 'classis',
    SUBDIVISION: 'classis',
    CLASSIS: 'ordo',
    SUBCLASSIS: 'ordo',
    SUPERORDO: 'ordo',
    ORDO: 'familia',
    SUBORDO: 'familia',
    COHORT: 'familia',
    FAMILIA: 'genus',
    SUBFAMILIA: 'genus',
    SECTION: 'species',
    SECTIO: 'species',
    SERIES: 'species',
    VARIETAS: 'subvarietas',
    SUBVARIETAS: 'subvarietas',
    FORMA: 'forma',

    NOTHOVARIETAS: 'nothovarietas',
    INFRASPECIES: 'infraspecies',
    REGIO: 'regio',
    SPECIALFORM: 'special form',
}

function pluralTaxon(rank: string) {
  if (rank === 'division') return 'divisions'
  else if (rank === 'kingdom') return 'kingdoms'
  else if (rank === 'phylum') return 'phyla'
  else if (rank === 'class') return 'classes'
  else if (rank === 'order') return 'orders'
  else if (rank === 'family') return 'families'
  else if (rank === 'genus') return 'genera'
  else return rank
}


function DataSummary({ rank, taxon }: { rank: string, taxon: Taxonomy | undefined }) {
  const childTaxon = CLASSIFICATIONS_CHILD_MAP[rank] || '';
  const childTaxonLabel = pluralTaxon(childTaxon);

  const thresholds = [
    { name: "low", color: "#f47625", start: 0, end: 50 },
    { name: "decent", color: "#febb1e", start: 50, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ]

  const rankGenomes = taxon?.descendants.filter(d => d.speciesGenomes > 0).map(summary => {
    return {
      name: summary.canonicalName || '',
      value: summary.speciesGenomes,
      href: `/${childTaxon}/${summary.canonicalName}`,
    }
  })

  const speciesGenomes = taxon?.speciesGenomeSummary.filter(i => i.genomes > 0).map(summary => {
    const linkName = encodeURIComponent(summary.name.replaceAll(' ', '_'));
    return {
      name: summary.name || '',
      value: summary.genomes,
      href: `/species/${linkName}`,
    }
  }).sort((a, b) => b.value - a.value)

  const speciesOther = taxon?.speciesSummary.filter(i => i.totalGenomic > 0).map(summary => {
    const linkName = encodeURIComponent(summary.name.replaceAll(' ', '_'));
    return {
      name: summary.name || '',
      value: summary.totalGenomic,
      href: `/species/${linkName}`,
    }
  }).sort((a, b) => b.value - a.value)

  const genomePercentile = taxon && (taxon.summary.speciesGenomes / taxon.summary.species) * 100;
  const otherPercentile = taxon && (taxon.summary.speciesData / taxon.summary.species) * 100;

  function collapsable(span: number) {
    return { base: span, xs: 12, sm: 12, md: span, lg: span, xl: span };
  }

  return (
    <Grid>
      <Grid.Col span="auto">
        <Title order={5}>Data summary</Title>
        <Grid>
          <Grid.Col span={collapsable(4)}>
            <Stack>
              <Text fz="sm" fw={300}>Percentage of species with genomes</Text>
              { taxon && <TachoChart mt={10} h={150} w={300} thresholds={thresholds} value={Math.round(genomePercentile || 0)} /> }
            </Stack>
          </Grid.Col>
          { rank !== 'GENUS' &&
          <Grid.Col span={collapsable(3)}>
            <Stack>
              <Text fz="sm" fw={300}>{Humanize.capitalize(childTaxonLabel)} with genomes</Text>
              { rankGenomes && <PieChart h={180} w={180} data={rankGenomes} /> }
            </Stack>
          </Grid.Col>
          }
          <Grid.Col span={collapsable(rank === 'GENUS' ? 8 : 5)}>
            <Stack>
              <Text fz="sm" fw={300}>Species with genomes</Text>
              { speciesGenomes && <BarChart h={200} data={speciesGenomes.slice(0, 8)} spacing={0.1} /> }
            </Stack>
          </Grid.Col>
          <Grid.Col span={collapsable(4)}>
            <Stack>
              <Text fz="sm" fw={300}>Percentage of species with any genetic data</Text>
              { taxon && <TachoChart mt={10} h={150} w={300} thresholds={thresholds} value={Math.round(otherPercentile || 0)} /> }
            </Stack>
          </Grid.Col>
          <Grid.Col span={collapsable(8)}>
            <Stack>
              <Text fz="sm" fw={300}>Species with any genetic data</Text>
              {speciesOther && <BarChart h={200} data={speciesOther.slice(0, 8)} spacing={0.1} /> }
            </Stack>
          </Grid.Col>
        </Grid>
      </Grid.Col>

      <Grid.Col span="content">
        <Paper p="xl" radius="lg" withBorder>
          <Title order={5}>Taxonomic breakdown</Title>

          <DataTable my={8}>
            <DataTableRow label={`Number of ${childTaxonLabel}`}>
              <DataField value={taxon?.descendants.length}></DataField>
            </DataTableRow>
            <DataTableRow label="Number of species/OTUs">
              <DataField value={Humanize.formatNumber(taxon?.summary.species || 0)} />
            </DataTableRow>
            <DataTableRow label={`${Humanize.capitalize(childTaxonLabel)} with genomes`}>
              <DataField value={Humanize.formatNumber(taxon?.descendants.filter(d => d.speciesGenomes > 0).length || 0)} />
            </DataTableRow>
            <DataTableRow label="Species with genomes">
              <DataField value={Humanize.formatNumber(taxon?.summary.speciesGenomes || 0)} />
            </DataTableRow>
            <DataTableRow label={`${Humanize.capitalize(childTaxonLabel)} with data`}>
              <DataField value={Humanize.formatNumber(taxon?.descendants.filter(d => d.speciesData > 0).length || 0)} />
            </DataTableRow>
            <DataTableRow label="Species with data">
              <DataField value={Humanize.formatNumber(taxon?.summary.speciesData || 0)} />
            </DataTableRow>
          </DataTable>

          <Stack mx={10} mt={5}>
            <Attribute
              label="Species with most genomes"
              value={speciesGenomes && speciesGenomes[0]?.name}
              href={`/species/${speciesGenomes && speciesGenomes[0]?.name?.replaceAll(' ', '_')}/taxonomy`}
            />
            <Attribute
              label="Species with most data"
              value={speciesOther && speciesOther[0]?.name}
              href={`/species/${speciesOther && speciesOther[0]?.name.replaceAll(' ', '_')}/taxonomy`}
            />
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}


export default function ClassificationPage({ params }: { params: { rank: string, name: string } }) {
  const rank = params.rank.toUpperCase();
  const childTaxon = CLASSIFICATIONS_CHILD_MAP[rank].toUpperCase() || '';

  const pathname = usePathname();
  const [_, setPreviousPage] = usePreviousPage();

  const taxonResults = useQuery<TaxonResults>(GET_TAXON, {
    variables: {
      rank,
      canonicalName: params.name,
      descendantRank: childTaxon,
    },
  });
  useEffect(() => {
    setPreviousPage({ name: `browsing ${params.name}`, url: pathname })
  }, [setPreviousPage])

  return (
    <Stack mt={40}>
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
              <DataSummary rank={rank} taxon={taxonResults.data?.taxon} />
            </Paper>

            <Paper p="xl" radius="lg" pos="relative" withBorder>
              <Species rank={rank} canonicalName={params.name} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
