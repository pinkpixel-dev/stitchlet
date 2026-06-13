import { describe, expect, test } from "vitest";
import { createApp } from "../app";
import { createTestDatabase } from "../test/test-db";

describe("counter routes", () => {
  test("creates, lists, updates, and deletes counters for a project", async () => {
    const testDb = createTestDatabase();
    const app = createApp({ db: testDb.db });

    await app.request("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        title: "Pocket Fox",
        status: "active",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const emptyListResponse = await app.request("/api/projects/pocket-fox/counters");
    expect(emptyListResponse.status).toBe(200);
    expect(await emptyListResponse.json()).toEqual({ counters: [] });

    const createResponse = await app.request("/api/projects/pocket-fox/counters", {
      method: "POST",
      body: JSON.stringify({
        name: "Body",
        type: "round",
        currentValue: 3,
        targetValue: 12,
        notes: "Increase every other round.",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    expect(created.counter).toMatchObject({
      projectId: "pocket-fox",
      name: "Body",
      type: "round",
      currentValue: 3,
      targetValue: 12,
      isCompleted: false,
    });

    const updateResponse = await app.request(`/api/counters/${created.counter.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        currentValue: 4,
        isCompleted: true,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.counter).toMatchObject({
      id: created.counter.id,
      type: "round",
      currentValue: 4,
      isCompleted: true,
    });

    const listResponse = await app.request("/api/projects/pocket-fox/counters");
    expect(listResponse.status).toBe(200);
    const listed = await listResponse.json();
    expect(listed.counters).toHaveLength(1);
    expect(listed.counters[0].currentValue).toBe(4);

    const deleteResponse = await app.request(`/api/counters/${created.counter.id}`, {
      method: "DELETE",
    });
    expect(deleteResponse.status).toBe(204);

    const finalListResponse = await app.request("/api/projects/pocket-fox/counters");
    expect(finalListResponse.status).toBe(200);
    expect(await finalListResponse.json()).toEqual({ counters: [] });

    testDb.sqlite.close();
  });

  test("rejects invalid counter payloads", async () => {
    const testDb = createTestDatabase();
    const app = createApp({ db: testDb.db });

    await app.request("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        title: "Pocket Fox",
        status: "active",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await app.request("/api/projects/pocket-fox/counters", {
      method: "POST",
      body: JSON.stringify({
        name: "",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    expect(response.status).toBe(400);

    testDb.sqlite.close();
  });
});
