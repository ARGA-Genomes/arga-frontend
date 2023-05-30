'use client';

import {WholeGenomeDetails} from "@/app/species/[name]/wholeGenome/wholeGenomeDetails";

export default function WholeGenomePage({ params }: { params: { name: string } }) {

    const speciesName = params.name;

    return (
      <>
        <WholeGenomeDetails speciesName={speciesName}/>
      </>
    )
}
