'use client';

import * as Humanize from "humanize-plus";
import { SimpleGrid, Stack, Text, Title, useMantineTheme} from "@mantine/core";


type DatasetProps = {
  total: number,
  name: string,
};

function Dataset(params: DatasetProps) {
  const theme = useMantineTheme();
  return (<>
      <div>
        <div style={{ backgroundColor: theme.colors.midnight[7], borderRadius: "50%", border:"1px solid #59A39C", height: "50%",
          aspectRatio:"1/1", margin:"auto"}}>
          <Stack style={{ transform: "translate(0, 2.5vw)"}}>
            <Text size={30} color="white" m={0} p={0} h={20} align={"center"}>{Humanize.compactInteger(params.total)}</Text>
            <Text size="sm" color="white" align="center" m={0} p={0}>downloads</Text>
          </Stack>
        </div>
        <Text size="sm" color="white" align="center">{params.name}</Text>
      </div>
    </>
  )
}


export default function MostDownloadedCard() {
  return (
    <Stack mah={{base:"180px", xl:"240px"}}>
      <Title order={3} color="wheat.3" align={"center"} weight={10}>Most downloaded</Title>

      <SimpleGrid cols={2}>
        <Dataset total={14000} name="Whole genome" />
        <Dataset total={456} name="Mito genome" />
      </SimpleGrid>
    </Stack>
  )
}
