import fs from "node:fs/promises";
import { parse } from "csv-parse";

const csvFilePath = new URL(
  "../../resources/example_tasks.csv",
  import.meta.url
);

export async function insertFromCsv() {
  let count = 0;
  const content = await fs.readFile(csvFilePath, "utf-8");
  const parser = parse(content);

  for await (const record of parser) {
    // skips first row
    if (count === 0) {
      count++;
      continue;
    }

    const [title, description] = record;

    fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    }).then((r) => r.text());

    count++;
  }
}
