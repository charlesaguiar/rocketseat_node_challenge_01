import fs from "node:fs/promises";
import { DbData, SearchCriteria } from "@/types/database";
import { filterData, getDefinedFields } from "@/utils/database";

const dbPath = new URL("../db.json", import.meta.url);

export class Database<TData extends DbData> {
  #database: Record<string, Array<TData>> = {};
  #table = "";

  constructor(table: string) {
    this.#table = table;
    fs.readFile(dbPath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database));
  }

  count() {
    return (this.#database[this.#table] ?? []).length;
  }

  select(search?: SearchCriteria<TData>) {
    const data = this.#database[this.#table] ?? [];

    if (search?.value) {
      return filterData<TData>(data, search);
    }

    return data;
  }

  selectById(id: string) {
    const data = this.#database[this.#table] ?? [];
    return data.find((row) => row.id === id);
  }

  insert(data: TData) {
    if (Array.isArray(this.#database[this.#table])) {
      this.#database[this.#table].push(data);
    } else {
      this.#database[this.#table] = [data];
    }

    this.#persist();
    return data;
  }

  bulkInsert(data: TData[]) {
    const rows = this.#database[this.#table];
    if (Array.isArray(rows)) {
      this.#database[this.#table].push(...rows, ...data);
    } else {
      this.#database[this.#table] = [...data];
    }

    this.#persist();
    return data;
  }

  update(id: string, fields: Partial<TData> = {}) {
    const data = this.#database[this.#table] ?? [];
    const recordIndex = data.findIndex((r) => r.id === id);

    if (recordIndex > -1) {
      const record = data[recordIndex];
      data[recordIndex] = { ...record, ...getDefinedFields(fields) };
      this.#persist();
    }
  }

  reset() {
    this.#database[this.#table] = [];
    this.#persist();
  }

  delete(id: string) {
    const data = this.#database[this.#table];
    if (Array.isArray(data)) {
      this.#database[this.#table] = data.filter((r) => r.id !== id);
      this.#persist();
      return;
    }
  }
}
