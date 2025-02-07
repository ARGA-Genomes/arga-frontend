import Markers from "@/views/species/markers/page";

export default function Page(props: { params: Promise<{ name: string }> }) {
  return <Markers {...props} />;
}
