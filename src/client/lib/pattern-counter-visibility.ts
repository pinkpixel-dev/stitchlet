import type { Counter } from "../../shared/schemas";

export function getDefaultVisibleCounterIds(counters: Counter[]) {
  const firstCounter = counters.find((counter) => !counter.isCompleted) ?? counters[0];
  return firstCounter ? [firstCounter.id] : [];
}

export function getStoredVisibleCounterIds(counters: Counter[], storedValue: string | null) {
  if (storedValue === null) {
    return getDefaultVisibleCounterIds(counters);
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue) || !parsedValue.every((value) => typeof value === "string")) {
      return getDefaultVisibleCounterIds(counters);
    }

    const counterIds = new Set(counters.map((counter) => counter.id));
    const visibleIds = [...new Set(parsedValue)].filter((id) => counterIds.has(id));

    if (parsedValue.length > 0 && visibleIds.length === 0) {
      return getDefaultVisibleCounterIds(counters);
    }

    return visibleIds;
  } catch {
    return getDefaultVisibleCounterIds(counters);
  }
}

export function setCounterVisibility(currentIds: string[], counterId: string, isVisible: boolean) {
  if (isVisible) {
    return currentIds.includes(counterId) ? currentIds : [...currentIds, counterId];
  }

  return currentIds.filter((id) => id !== counterId);
}
