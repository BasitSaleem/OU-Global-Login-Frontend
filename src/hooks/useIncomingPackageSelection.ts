"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  clearStoredPackageSelection,
  persistPackageQuery,
  readStoredPackageSelection,
  resolveIncomingPackageSelection,
  StoredPackageSelection,
} from "@/utils/incomingPackageSelection";

export const clearIncomingPackageSelection = clearStoredPackageSelection;

export function useIncomingPackageSelection() {
  const query = useSearchParams().toString();
  const [saved, setSaved] = useState<StoredPackageSelection>({});
  const [readyQuery, setReadyQuery] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(query);
    persistPackageQuery(params);
    setSaved(readStoredPackageSelection());
    setReadyQuery(query);
  }, [query]);
  const selection = useMemo(
    () => resolveIncomingPackageSelection(new URLSearchParams(query), saved),
    [query, saved],
  );
  return { ...selection, isReady: readyQuery === query };
}
