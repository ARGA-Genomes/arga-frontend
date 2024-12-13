import { AbstractBackend, Types, createFlags } from "flag";
import React, { PropsWithChildren, ReactNode } from "react";

export enum FlagOrdering {
  TotalData = "total_data",
  Taxonomy = "taxonomy",
}

export type Flags = {
  ordering: FlagOrdering;
};

const DEFAULT_FLAGS = {
  ordering: FlagOrdering.TotalData,
};

export class MutableBackend extends AbstractBackend<Flags> {
  flags: Flags | null = null;

  constructor(flags: Flags) {
    super();
    this.flags = flags;
  }

  getSnapshot<
    KP extends Types.KeyPath<Flags>,
    T extends Types.GetValueFromKeyPath<Flags, KP>
  >(keyPath: KP, defaultValue: T): T {
    if (keyPath === undefined) {
      return defaultValue;
    }

    let result: any = this.flags;

    for (const key of keyPath as string[]) {
      result = result[key];

      if (result === undefined) {
        return defaultValue;
      }
    }

    return result;
  }

  setFlag<
    KP extends Types.KeyPath<Flags>,
    T extends Types.GetValueFromKeyPath<Flags, KP>
  >(keyPath: KP, value: T) {
    let result: any = this.flags;

    for (const key of keyPath as string[]) {
      if (result[key] instanceof Object) {
        result = result[key];
      } else {
        result[key] = value;
      }
    }

    this.notify();
  }
}

const BACKEND = new MutableBackend(DEFAULT_FLAGS);
const FeatureFlagContext = React.createContext(BACKEND);

export function FeatureFlagProvider({ children }: { children: any }) {
  return (
    <FeatureFlagContext.Provider value={BACKEND}>
      <FlagBackendProvider backend={BACKEND}>{children}</FlagBackendProvider>
    </FeatureFlagContext.Provider>
  );
}

export const useFeatureFlag = () => React.useContext(FeatureFlagContext);
export const { FlagBackendProvider, Flag, useFlag } = createFlags<Flags>();
