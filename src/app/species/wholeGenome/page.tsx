'use client';

import {Component} from "react";
import {WholeGenomeDetails} from "@/app/species/wholeGenome/wholeGenomeDetails";

export default class WholeGenomePage extends Component {

  render() {

    let speciesName = this.props.searchParams.name;

    return (
      <>
        <WholeGenomeDetails speciesName={speciesName}/>
      </>
    )
  }
}
