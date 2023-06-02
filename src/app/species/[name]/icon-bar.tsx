import { Species } from "@/app/type";
import { Box, Group, ThemeIcon, Image, Tooltip } from "@mantine/core";


function statusIcon(status: string) {
  switch (status) {
    case 'Native':
      return { image: 'native.svg', label: 'Native Species', color: 'wheat.4' }
    case 'Vulnerable':
      return { image: 'threatened.svg', label: 'Vulnerable Species', color: 'wheat.6' }
    case 'Vulnerable (Wildfire)':
      return { image: 'vulnerable_fire.svg', label: 'Vulnerable to Wildfire', color: 'bushfire.5' }
    case 'Endangered':
      return { image: 'threatened_light.svg', label: 'Endangered Species', color: 'bushfire.4' }
    case 'Critically endangered':
      return { image: 'threatened.svg', label: 'Critically endangered', color: 'red' }
    case 'Extinct':
      return { image: 'threatened_light.svg', label: 'Extinct Species', color: 'black' }
  }
}

function Icon({ status }: { status: string }) {
  const icon = statusIcon(status)

  return (
    <Tooltip label={icon?.label}>
      <ThemeIcon radius="xl" size={60} color={icon?.color} p={10}>
        <Image src={`/species-icons/${icon?.image}`} />
      </ThemeIcon>
    </Tooltip>
  )
}


export default function IconBar({ species }: { species: Species }) {
  return (
    <Box>
      <Group>
        { species.conservation.map(cons => (
            <Icon status={cons.status}/>
        ))}
      </Group>
    </Box>
  )
}
