import { Specimen } from "@/app/type";
import { gql, useQuery } from "@apollo/client";
import { Table } from "@mantine/core";

const GET_SPECIMENS = gql`
query Species($canonicalName: String) {
  species(canonicalName: $canonicalName) {
    specimens {
      typeStatus
      institutionName
      organismId
      locality
      latitude
      longitude
      details
      remarks
    }
  }
}`;

type Species = {
  specimens: Specimen[],
}

type QueryResults = {
    species: Species,
}


export default function SpecimenTable({ canonicalName }: { canonicalName: string }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIMENS, {
    variables: {
        canonicalName,
    },
  });

  return (
    <Table striped highlightOnHover withColumnBorders>
      <thead>
        <tr>
          <td>Type status</td>
          <td>Institution</td>
          <td>Organism ID</td>
          <td>Locality</td>
          <td>Details</td>
          <td>Remarks</td>
        </tr>
      </thead>
      <tbody>
        { data?.species.specimens.map(specimen => {
            return (
              <tr>
                <td>{specimen.typeStatus}</td>
                <td>{specimen.institutionName}</td>
                <td>{specimen.organismId}</td>
                <td>{specimen.locality}</td>
                <td>{specimen.details}</td>
                <td>{specimen.remarks}</td>
              </tr>
            )
        })}
      </tbody>
    </Table>
  )
}
