import { describe, expect, test } from "vitest";
import type { Counter } from "../../shared/schemas";
import {
  getDefaultVisibleCounterIds,
  getStoredVisibleCounterIds,
  setCounterVisibility,
} from "./pattern-counter-visibility";

const counters: Counter[] = [
  {
    id: "completed-counter",
    projectId: "project-1",
    name: "Body",
    type: "round",
    currentValue: 20,
    isCompleted: true,
    sortOrder: 0,
    createdAt: "2026-08-08T20:00:00.000Z",
    updatedAt: "2026-08-08T20:00:00.000Z",
  },
  {
    id: "active-counter",
    projectId: "project-1",
    name: "Wing",
    type: "row",
    currentValue: 3,
    isCompleted: false,
    sortOrder: 1,
    createdAt: "2026-08-08T20:00:00.000Z",
    updatedAt: "2026-08-08T20:00:00.000Z",
  },
];

describe("pattern counter visibility", () => {
  test("starts with the first unfinished counter", () => {
    expect(getDefaultVisibleCounterIds(counters)).toEqual(["active-counter"]);
  });

  test("falls back to the first counter when all counters are complete", () => {
    expect(getDefaultVisibleCounterIds([{ ...counters[0] }])).toEqual(["completed-counter"]);
  });

  test("keeps an intentional empty selection", () => {
    expect(getStoredVisibleCounterIds(counters, "[]")).toEqual([]);
  });

  test("filters duplicate and deleted stored counter ids", () => {
    expect(
      getStoredVisibleCounterIds(
        counters,
        JSON.stringify(["active-counter", "deleted-counter", "active-counter"]),
      ),
    ).toEqual(["active-counter"]);
  });

  test("uses the default when stored data is invalid or fully stale", () => {
    expect(getStoredVisibleCounterIds(counters, "not-json")).toEqual(["active-counter"]);
    expect(getStoredVisibleCounterIds(counters, JSON.stringify(["deleted-counter"]))).toEqual([
      "active-counter",
    ]);
  });

  test("adds and removes counter ids without duplicates", () => {
    expect(setCounterVisibility(["completed-counter"], "active-counter", true)).toEqual([
      "completed-counter",
      "active-counter",
    ]);
    expect(setCounterVisibility(["active-counter"], "active-counter", true)).toEqual([
      "active-counter",
    ]);
    expect(setCounterVisibility(["completed-counter", "active-counter"], "completed-counter", false)).toEqual([
      "active-counter",
    ]);
  });
});
