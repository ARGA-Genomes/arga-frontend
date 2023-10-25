'use client'

import { useContext, useEffect, useState } from "react";
import init, { parse_remote, Trace, Error } from "@arga/trace-file-parser-wasm";
import React from "react";


export function useTraceLoader(url: string) {
  const [trace, setTrace] = useState<Trace|null>(null);
  const [error, setError] = useState<Error|null>(null);
  const [loading, setLoading] = useState(true);

  const { initialized, cache, addToCache } = useTraceParser();

  useEffect(() => {
    if (!initialized) return;

    const trace = cache.get(url);
    if (trace) {
      setTrace(trace);
    }
    else {
      parse_remote(url).then(trace => {
        addToCache(url, trace);
        setTrace(trace);
      }).catch(err => {
        setError(err);
      });
    }

    setLoading(false);
  }, [initialized, setLoading]);

  return {
    loading,
    error,
    trace,
  }
}


interface TraceLoaderState {
  initialized: boolean,
  cache: Map<string, Trace>,
  addToCache: (url: string, trace: Trace) => void,
}

export const TraceLoaderContext = React.createContext<TraceLoaderState>({
  initialized: false,
  cache: new Map(),
  addToCache: (_url, _trace) => {},
})


export function TraceLoaderProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState(new Map());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    init().then(() => setInitialized(true));
  }, []);

  const state = {
    initialized,
    cache,
    addToCache: (url: string, trace: Trace) => {
      setCache(cache.set(url, trace));
    }
  }

  return (
     <TraceLoaderContext.Provider value={state}>
        {children}
     </TraceLoaderContext.Provider>
  )
};

export const useTraceParser = () => {
  const state = useContext(TraceLoaderContext);
  return state;
};
