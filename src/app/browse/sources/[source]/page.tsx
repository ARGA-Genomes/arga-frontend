import SourcePage from "@/views/source/page";
import { use } from "react";

export default function BrowseSourcePage(props: { params: Promise<{ source: string }> }) {
  const params = use(props.params);
  const cleanedName = decodeURIComponent(params.source).replaceAll("_", " ");

  return <SourcePage source={cleanedName} name={cleanedName} />;
}
