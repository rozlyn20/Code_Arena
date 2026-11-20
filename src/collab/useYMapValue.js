import { useCallback, useEffect, useState } from "react";

// Like useState, but the value lives in a Y.Map so it syncs between people/tabs.
// Used for per-document settings: language, stdin and the last run's output.
export function useYMapValue(ymap, key, fallback) {
  const [value, setValue] = useState(() =>
    ymap && ymap.has(key) ? ymap.get(key) : fallback,
  );

  useEffect(() => {
    if (!ymap) return undefined;
    const read = () => setValue(ymap.has(key) ? ymap.get(key) : fallback);
    read();
    ymap.observe(read);
    return () => ymap.unobserve(read);
    // fallback is always a constant at the call sites
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ymap, key]);

  const set = useCallback((next) => ymap?.set(key, next), [ymap, key]);
  return [value, set];
}
