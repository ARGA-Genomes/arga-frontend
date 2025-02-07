import Specimens from "@/views/species/specimens/page";

export default function Page(props: { params: Promise<{ name: string }> }) {
  return <Specimens {...props} />;
}
