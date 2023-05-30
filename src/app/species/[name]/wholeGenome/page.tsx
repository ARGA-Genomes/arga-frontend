'use client';

import {WholeGenomeDetails} from "@/app/species/wholeGenome/wholeGenomeDetails";

export default function WholeGenomePage({ params }: { params: { name: string } }) {

    const speciesName = params.name;

    return (
      <>
        <h1>{params.name}</h1>
        <WholeGenomeDetails speciesName={speciesName}/>
      </>
    )
}
