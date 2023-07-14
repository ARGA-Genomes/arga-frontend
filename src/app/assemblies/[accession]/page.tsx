"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Assembly, AssemblyStats, BioSample } from "@/app/type";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  LoadingOverlay,
  Paper,
  Text,
  Title,
} from "@mantine/core";

const GET_ASSEMBLY = gql`
  query AssemblyDetails($accession: String) {
    assembly(accession: $accession) {
      id
      accession
      nuccore
      refseqCategory
      specificHost
      cloneStrain
      versionStatus
      contamScreenInput
      releaseType
      genomeRep
      gbrsPairedAsm
      pairedAsmComp
      excludedFromRefseq
      relationToTypeMaterial
      asmNotLiveDate
      otherCatalogNumbers
      recordedBy
      geneticAccessionUri
      eventDate

      stats {
        id
        totalLength
        spannedGaps
        unspannedGaps
        componentCount
        contigCount
        contigL50
        contigN50
        gcPerc
        moleculeCount
        regionCount
        scaffoldCount
        scaffoldL50
        scaffoldN50
        scaffoldN75
        scaffoldN90
        topLevelCount
        totalGapLength
      }

      biosamples {
        id
        accession
        sra
        submissionDate
        publicationDate
        lastUpdate
        title
        owner
        attributes
      }
    }
  }
`;

type AssemblyDetails = Assembly & {
  stats?: AssemblyStats;
  biosamples: BioSample[];
};

type QueryResults = {
  assembly: AssemblyDetails;
};

interface FieldProps {
  label: string;
  value?: string | number;
}

function Field(props: FieldProps) {
  return (
    <Box>
      <Text color="dimmed" size="xs">
        {props.label}
      </Text>
      <Text size="sm" weight="bold" c={props.value ? "black" : "dimmed"}>
        {props.value || "Not Supplied"}
      </Text>
    </Box>
  );
}

function Details({ assembly }: { assembly: Assembly }) {
  return (
    <Grid>
      <Grid.Col span={8}>
        <Title order={4} mb={20}>
          {assembly.accession}
        </Title>
      </Grid.Col>
      <Grid.Col span={4}>
        <Flex justify="flex-end">
          <Button
            component="a"
            href={assembly.geneticAccessionUri}
            target="_blank"
          >
            Get Genome
          </Button>
        </Flex>
      </Grid.Col>

      <Grid.Col span={3}>
        <Field label="Accession" value={assembly.accession} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Category" value={assembly.refseqCategory} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Specific Host" value={assembly.specificHost} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Clone Strain" value={assembly.cloneStrain} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Version" value={assembly.versionStatus} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Contam Screen Input" value={assembly.contamScreenInput} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Release Type" value={assembly.releaseType} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Genome Rep" value={assembly.genomeRep} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Gbrs Paired Asm" value={assembly.gbrsPairedAsm} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Paired Asm Comp" value={assembly.pairedAsmComp} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field
          label="Excluded from Refseq"
          value={assembly.excludedFromRefseq}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field
          label="Relation to Type Material"
          value={assembly.relationToTypeMaterial}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Asm Not Live Date" value={assembly.asmNotLiveDate} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field
          label="Other Catalog Numbers"
          value={assembly.otherCatalogNumbers}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Recorded By" value={assembly.recordedBy} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Event Date" value={assembly.eventDate} />
      </Grid.Col>
    </Grid>
  );
}

function Stats({ stats }: { stats: AssemblyStats }) {
  return (
    <>
      <Divider m={30} />
      <Title order={4} mb={20}>
        Assembly Statistics
      </Title>
      <Grid>
        <Grid.Col span={3}>
          <Field label="Component Count" value={stats.componentCount} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Contig Count" value={stats.contigCount} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Contig L50" value={stats.contigL50} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Contig N50" value={stats.contigN50} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="GC Perc" value={stats.gcPerc} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Molecule Count" value={stats.moleculeCount} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Region Count" value={stats.regionCount} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Scaffold Count" value={stats.scaffoldCount} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Scaffold L50" value={stats.scaffoldL50} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Scaffold N50" value={stats.scaffoldN50} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Scaffold N75" value={stats.scaffoldN75} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Scaffold N90" value={stats.scaffoldN90} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Total Length" value={stats.totalLength} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Top Level Count" value={stats.topLevelCount} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Total Gap Length" value={stats.totalGapLength} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Spanned Gaps" value={stats.spannedGaps} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Unspanned Gaps" value={stats.unspannedGaps} />
        </Grid.Col>
      </Grid>
    </>
  );
}

function BioSample({ biosample }: { biosample: BioSample }) {
  function sanitizeValue(value: string) {
    if (value == "missing") return undefined;
    return value;
  }
  function sanitizeLabel(label: string) {
    return Humanize.capitalizeAll(label.replaceAll("_", " "));
  }

  return (
    <>
      <Divider m={30} />
      <Title order={4} mb={20}>
        BioSample: {biosample.accession}
      </Title>
      <Grid>
        <Grid.Col span={3}>
          <Field label="Accession" value={biosample.accession} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="SRA" value={biosample.sra} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Submission Date" value={biosample.submissionDate} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Publication Date" value={biosample.publicationDate} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Last Update" value={biosample.lastUpdate} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Title" value={biosample.title} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Field label="Owner" value={biosample.owner} />
        </Grid.Col>
        {biosample.attributes?.map((attr) => (
          <Grid.Col span={3} key={`${biosample.id}${attr.name}${attr.value}`}>
            <Field
              label={sanitizeLabel(attr.name)}
              value={sanitizeValue(attr.value)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}

export default function AssemblyPage({
  params,
}: {
  params: { accession: string };
}) {
  const { loading, error, data } = useQuery<QueryResults>(GET_ASSEMBLY, {
    variables: {
      accession: params.accession,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: "xl", color: "moss.5" }}
        visible={loading}
      />
      <Paper radius="lg" p={30}>
        {data && <Details assembly={data.assembly} />}
        {data?.assembly.stats && <Stats stats={data.assembly.stats} />}
        {data?.assembly.biosamples.map((biosample) => (
          <BioSample biosample={biosample} key={biosample.id} />
        ))}
      </Paper>
    </Box>
  );
}
