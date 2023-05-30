'use client';

import { Grid, Paper, Stack, Text } from "@mantine/core";
import { QueryResults} from "@/app/type";
import {gql, useQuery} from "@apollo/client";
import {GenomeRecords} from "@/app/species/[name]/genomeRecords";


const GET_SPECIES = gql`
  query Species($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      data {
        canonicalName
        type
        dataResource
        recordedBy
        license
        provenance
        eventDate
        accession
        accessionUri
        refseqCategory
      }
    }
  }`;

export function WholeGenomeDetails({ speciesName }: { speciesName : String }) {

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      canonicalName: speciesName?.replaceAll("_", " "),
    },
  });

  if (loading) {
    return (<Text>Loading...</Text>);
  }
  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }
  if (!data) {
    return (<Text>No data</Text>);
  }

  const otherWholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome" &&
    !record.accession?.includes("GCF_"));
  const referenceGenome = data.species.data.filter((record) => record.refseqCategory == "reference genome"
    || record.accession?.includes("GCF_"));

  return (
  <>
    <Grid p={40}>
      <Grid.Col span="auto">
        <Paper bg="midnight.6" p={40} radius={35}>
          <Grid>
            <Grid.Col>
              <Text style={{ paddingBottom: 25 }} color="white">Whole Genome (Refseq)</Text>
              <Stack>
                <Text color="white">Species Name: {speciesName?.replaceAll("_", " ")}</Text>
                <Text c="dimmed">Reference Genome</Text>
                <Text color="white">Refseq: {referenceGenome.map((record => record.accession))}</Text>
                <Text color="white">{referenceGenome.map((record => record.accessionUri))}</Text>
              </Stack>
              <br/>
              <Text style={{ padding: 25 }} color="white">List of other assemblies</Text>
              <GenomeRecords data={ otherWholeGenomeRecords }/>
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
    </Grid>
  </>);
}
