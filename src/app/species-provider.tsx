import React, { ReactNode } from "react";

export interface SpeciesDetails {
  name: string;
}

interface SpeciesContextValue {
  details: SpeciesDetails;
}

const SpeciesContext = React.createContext<SpeciesContextValue | undefined>(undefined);

export function SpeciesProvider({ name, children }: { name: string; children?: ReactNode }) {
  const context = {
    details: {
      name,
    },
  };

  return <SpeciesContext.Provider value={context}>{children}</SpeciesContext.Provider>;
}

export const useSpecies = () => React.useContext(SpeciesContext);
