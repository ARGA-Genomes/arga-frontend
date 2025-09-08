import SourcePage from "@/views/source/page";
import { use } from "react";
import { GroupItem, map as queryMap } from "../_data/all";

export default function BrowseGroupPage(props: { params: Promise<{ list: string }> }) {
  const { list: rawList } = use(props.params);
  const list = decodeURIComponent(rawList).replaceAll("'", "");

  const group: GroupItem | undefined = (queryMap as Record<string, GroupItem>)[list];

  return <SourcePage source={group.source} name={list} group={group} />;
}
