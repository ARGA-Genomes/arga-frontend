import {
  Box,
  Button,
  Collapse,
  Grid,
  Group,
  Table,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { CommonGenome } from "@/app/type";
import {
  IconArrowUpRight,
  IconLicense,
  IconLink,
  IconPencil,
} from "@tabler/icons-react";
import Link from "next/link";
import { useListState } from "@mantine/hooks";
import React from "react";

const FORMATTED_TYPE: Record<string, string> = {
  PRESERVED_SPECIMEN: "Preserved specimen",
  OCCURRENCE: "Occurrence",
};

interface GenomeFieldProps {
  key: string;
  label: string;
  value?: string | string[] | object;
  icon: React.ReactNode;
}

const subFields: string[] = ["associatedSequences"];

const fields: GenomeFieldProps[] = [
  {
    key: "refseqCategory",
    label: "Category",
    icon: <IconLicense size={16} />,
  },
  {
    key: "occurrenceYear",
    label: "Occurred",
    icon: <IconLink size={16} />,
  },
  {
    key: "license",
    label: "License",
    icon: <IconLicense size={16} />,
  },
  {
    key: "provenance",
    label: "Provenance",
    icon: <IconLink size={16} />,
  },
  {
    key: "otherCatalogNumbers",
    label: "Catalog numbers",
    icon: <IconPencil size={16} />,
  },
  {
    key: "ncbiBioproject",
    label: "NCBI BioProject",
    icon: <IconLicense size={16} />,
  },
  {
    key: "recordedBy",
    label: "Recorded by",
    icon: <IconPencil size={16} />,
  },
  {
    key: "ncbiBiosample",
    label: "NCBI BioSample",
    icon: <IconLicense size={16} />,
  },
  {
    key: "ncbiReleaseType",
    label: "NCBI Release",
    icon: <IconLink size={16} />,
  },
  {
    key: "ncbiNuccore",
    label: "NCBI Nuccore",
    icon: <IconPencil size={16} />,
  },
  {
    key: "pairedAsmComp",
    label: "Paired Asm Comp",
    icon: <IconLicense size={16} />,
  },
  {
    key: "mixs0000005",
    label: "MIXS 0000005",
    icon: <IconLicense size={16} />,
  },
  {
    key: "mixs0000029",
    label: "MIXS 0000029",
    icon: <IconLicense size={16} />,
  },
  {
    key: "mixs0000026",
    label: "MIXS 0000026",
    icon: <IconLicense size={16} />,
  },
  {
    key: "sequenceID",
    label: "SequenceID",
    icon: <IconPencil size={16} />,
  },
  {
    key: "genbankAccession",
    label: "Genbank Accession",
    icon: <IconPencil size={16} />,
  },
  {
    key: "markercode",
    label: "Marker Code",
    icon: <IconPencil size={16} />,
  },
];

function GenomeField(props: GenomeFieldProps) {
  return (
    <Group justify="left">
      <ThemeIcon variant="light" size={28} radius="xl">
        {props.icon}
      </ThemeIcon>
      <Box>
        <Text c="dimmed" size="xs">
          {props.label}
        </Text>
        <Text size="sm" fw="bold" c={props.value ? "black" : "dimmed"}>
          {props.value?.toString() || "Not Supplied"}
        </Text>
      </Box>
    </Group>
  );
}

function renderField(key: string, value: string | string[] | object) {
  const field = fields.filter((field) => field.key == key)[0];
  const isObject = typeof value === "object" && value !== null;
  const isArray = Array.isArray(value);

  if (field && !isObject) {
    return (
      <Grid.Col span={3} key={key}>
        <GenomeField
          label={field.label}
          value={value}
          icon={field.icon}
          key={key}
        />
      </Grid.Col>
    );
  } else if (field && isArray) {
    return (
      <Grid.Col span={3} key={key}>
        <GenomeField
          label={field.label}
          value={JSON.parse(JSON.stringify(value))}
          icon={field.icon}
          key={key}
        />
      </Grid.Col>
    );
  } else if (!field && subFields.includes(key) && value !== null) {
    const subList: React.JSX.Element[] = Object.entries(value)
      .map(([k, v]) => renderField(k, v))
      .filter((el) => !!el);

    return <>{subList.map((el) => el)}</>;
  }
}

function GenomeDetails({ record }: { record: CommonGenome }) {
  return (
    <Grid>
      {Object.entries(record).map(([key, value]) => {
        return renderField(key, value);
      })}
      {record.associatedSequences.nucleotides && (
        <>
          <div style={{ display: "-webkit-flex" }}>
            <Grid.Col span={6}>
              <Group justify="left">
                <ThemeIcon variant="light" size={28} radius="xl">
                  <IconLicense size={16} />
                </ThemeIcon>
                <Text c="dimmed" size="xs">
                  Coloured Barcode
                </Text>
                <Barcode nucleotides={record.associatedSequences.nucleotides} />
              </Group>
            </Grid.Col>
            <Grid.Col span={6}>
              <Group justify="left">
                <ThemeIcon variant="light" size={28} radius="xl">
                  <IconLicense size={16} />
                </ThemeIcon>
                <Text c="dimmed" size="xs">
                  Nucleotides
                </Text>
                <textarea
                  cols={100}
                  rows={10}
                  readOnly={true}
                  value={record.associatedSequences.nucleotides}
                />
              </Group>
            </Grid.Col>
          </div>
        </>
      )}
    </Grid>
  );
}

interface GenomeRecordProps {
  record: CommonGenome;
  selected: boolean;
  onSelected: (record: CommonGenome) => void;
}

function GetBarcodeColours(param: string) {
  switch (param) {
    case "A":
      return "limegreen";
    case "C":
      return "blue";
    case "T":
      return "red";
    case "G":
      return "black";
    default:
      return "black";
  }
}

function Barcode({ nucleotides }: { nucleotides: string }) {
  const letters = nucleotides.split("");

  return (
    <div>
      {letters.map((letter, idx) => {
        const bg = GetBarcodeColours(letter);
        return (
          <span key={idx}>
            <div
              style={{
                backgroundColor: bg,
                height: 10,
                width: 3,
                display: "inline-block",
                verticalAlign: "top",
              }}
            ></div>
            <div
              style={{
                backgroundColor: "#fff",
                height: 10,
                width: 2,
                display: "inline-block",
                verticalAlign: "top",
              }}
            ></div>
          </span>
        );
      })}
    </div>
  );
}

function GenomeRecord(props: GenomeRecordProps) {
  return (
    <>
      <tr
        style={{ cursor: "pointer" }}
        onClick={() => {
          props.onSelected(props.record);
        }}
      >
        <td style={{ paddingLeft: 25 }}>{props.record.accession}</td>
        <td>
          {props.record.type
            ? FORMATTED_TYPE[props.record.type] || props.record.type
            : "Not Supplied"}
        </td>
        <td>{props.record.dataResource}</td>
        <td>{props.record.eventDate}</td>
        {props.record.accessionUri && (
          <td>
            <Link href={props.record.accessionUri} target="_blank">
              <Button
                size="xs"
                variant="light"
                rightSection={<IconArrowUpRight size={16} />}
              >
                All details
              </Button>
            </Link>
          </td>
        )}
      </tr>
      <tr>
        <td colSpan={8} style={{ padding: 0, border: "none" }}>
          <Collapse in={props.selected}>
            <Box p={20} bg="gray.1">
              <GenomeDetails record={props.record} />
            </Box>
          </Collapse>
        </td>
      </tr>
    </>
  );
}

export default function GenomeTable({ records }: { records: CommonGenome[] }) {
  const [selected, handler] = useListState<CommonGenome>([]);

  function toggle(record: CommonGenome) {
    const idx = selected.indexOf(record);
    if (idx >= 0) {
      handler.remove(idx);
    } else {
      handler.append(record);
    }
  }

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <td style={{ paddingLeft: 25 }}>Accession</td>
          <td>Type</td>
          <td>Data Resource</td>
          <td>Event Date</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {records.map((record, idx) => {
          return (
            <GenomeRecord
              record={record}
              selected={selected.includes(record)}
              onSelected={toggle}
              key={idx}
            />
          );
        })}
      </tbody>
    </Table>
  );
}
