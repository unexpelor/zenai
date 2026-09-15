"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Coordinates async AI localization so only the latest locale generation may commit.
 */
export function useAILocalization() {
  const generationRef = useRef(0);
  const controllerRef = useRef(null);

  const beginGeneration = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const generation = ++generationRef.current;
    return { generation, signal: controller.signal };
  }, []);

  const isCurrent = useCallback((generation) => {
    return generation === generationRef.current && !controllerRef.current?.signal.aborted;
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { beginGeneration, isCurrent };
}
