'use client';

import {WholeGenomeDetails} from "@/app/species/wholeGenome/wholeGenomeDetails";

export default function WholeGenomePage(props : any) {

    const speciesName = props.searchParams.name;

    return (
      <>
        <WholeGenomeDetails speciesName={speciesName}/>
      </>
    )
}
