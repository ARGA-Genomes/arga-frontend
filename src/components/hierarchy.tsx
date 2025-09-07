import { Dataset, Taxon } from "@/generated/types";
import { getTaxonIcon } from "@/helpers/getTaxonIcon";
import { isLatin, latinilizeNormalRank, normalizeLatinRank } from "@/helpers/rankHelpers";
import { Group, Skeleton, Text } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import * as Humanize from "humanize-plus";
import { useMemo } from "react";
import { ExternalLinkButton } from "./button-link-external";
import { AttributePill, AttributePillValue } from "./data-fields";

const ALL_RANKS = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];

interface SourcePillProps {
  value: string;
}

function SourcePill({ value }: SourcePillProps) {
  return (
    <AttributePillValue
      color="transparent"
      value={value}
      textColor="shellfish"
      style={{
        border: "1px solid var(--mantine-color-shellfish-5)",
        minWidth: 90,
      }}
      popoverDisabled
    />
  );
}

interface HierarchyProps {
  taxon?: Taxon;
  rawRank?: string;
  dataset?: Dataset;
}

export function Hierarchy({ taxon, rawRank, dataset }: HierarchyProps) {
  const details = useMemo(() => {
    if (taxon) {
      const latin = isLatin(taxon);
      const normalRank = normalizeLatinRank(taxon.rank);
      const latinRank = latinilizeNormalRank(taxon.rank);

      return {
        rank: (latin ? latinRank : normalRank).toUpperCase(),
        icon: getTaxonIcon(latinRank.toLowerCase(), taxon.canonicalName),
        hierarchy: taxon.hierarchy.toSorted((a, b) => b.depth - a.depth),
        latin,
        latinRank,
        normalRank,
      };
    }
  }, [taxon]);

  return (
    <Group justify="space-between" align="flex-end">
      <Group>
        {details
          ? details.hierarchy.map((node, idx) => (
              <AttributePill
                key={idx}
                label={
                  details.latin && node.rank !== "DOMAIN"
                    ? latinilizeNormalRank(node.rank)
                    : Humanize.capitalize(node.rank.toLowerCase())
                }
                value={node.canonicalName}
                href={`/${(details.latin && node.rank !== "DOMAIN"
                  ? latinilizeNormalRank(node.rank)
                  : node.rank
                ).toLowerCase()}/${node.canonicalName}`}
                icon={IconArrowUpRight}
                popoverDisabled
                showIconOnHover
              />
            ))
          : ALL_RANKS.slice(
              0,
              ALL_RANKS.indexOf(rawRank ? normalizeLatinRank(rawRank).toUpperCase() : "species") + 1
            ).map((skeletonRank) => (
              <AttributePill
                loading
                key={skeletonRank}
                label={Humanize.capitalize(skeletonRank)}
                value="Placeholder"
                icon={IconArrowUpRight}
                showIconOnHover
              />
            ))}
      </Group>
      <Group>
        <Text fw={300} size="xs">
          Source
        </Text>
        <Group>
          <Skeleton visible={!dataset} radius="xl">
            <ExternalLinkButton
              url={dataset?.url || "#"}
              externalLinkName={dataset?.name || "Dataset Name"}
              outline
              icon={IconArrowUpRight}
            />
          </Skeleton>
        </Group>
      </Group>
    </Group>
  );
}
