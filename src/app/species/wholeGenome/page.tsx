'use client';

import {Props} from "html-react-parser/lib/attributes-to-props";
import {WholeGenomeDetails} from "@/app/species/wholeGenome/wholeGenomeDetails";

export default function WholeGenomePage(props : Props) {

    const speciesName = props.searchParams.name;

    return (
      <>
        <WholeGenomeDetails speciesName={speciesName}/>
      </>
    )
}
