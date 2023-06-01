'use client';

import { Grid, Paper, Stack, Text } from "@mantine/core";
import { QueryResults} from "@/app/type";
import {gql, useQuery} from "@apollo/client";
import {GenomeRecords} from "@/app/species/[name]/genomeRecords";
import {Box} from "@mantine/core";


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

  const otherWholeGenomeRecords = data.species.data.filter((record) => (record.refseqCategory == "representative genome" &&
    !record.accession?.includes("GCF_")) || record.accession?.includes("GCA_"));
  const referenceGenome = data.species.data.filter((record) => record.refseqCategory == "reference genome"
    || record.accession?.includes("GCF_"));

  return (
  <>
    <Grid p={40}>
      <Grid.Col span="auto">
        <Paper bg="midnight.6" p={40} radius={35}>
          <Grid>
            <Grid.Col>
              <h2 style={{ paddingBottom: 25 }} color="white">Whole Genome (Refseq)</h2>
              <Stack>
                <Paper bg="#3A637C" radius={35}>
                  <Text color="white" style={{ padding: 15 }}>Species Name: {speciesName?.replaceAll("_", " ")}</Text>
                  <h3 color="white" style={{ padding: 15 }}>Reference Genome</h3>
                  <Text color="white" style={{ padding: 15 }}>Refseq: {referenceGenome.map((record => record.accession))}</Text>
                  <Text color="white" style={{ padding: 15 }}>{referenceGenome.map((record => record.accessionUri))}</Text>
                </Paper>
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
