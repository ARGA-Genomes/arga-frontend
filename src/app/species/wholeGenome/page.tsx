'use client';

import {WholeGenomeDetails} from "@/app/species/wholeGenome/wholeGenomeDetails";

export default function WholeGenomePage(props : any) {

    const speciesName = props.searchParams.name;
    console.log(props);

    return (
      <>
        <h1>{props.searchParams.name}</h1>
        <WholeGenomeDetails speciesName={speciesName}/>
      </>
    )
}
