import { DbData, SearchCriteria } from "@/types/database";

export function getDefinedFields(fields: Record<string, unknown>) {
  return Object.keys(fields)
    .map((k) => {
      if (fields[k] !== undefined) {
        return { [k]: fields[k] };
      }
    })
    .filter(Boolean)
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

export const filterData = <T extends DbData>(
  data: T[],
  search: SearchCriteria<T>
) => {
  return data.filter((row) => {
    const rowKeys = Object.keys(row) as (keyof T)[];
    return rowKeys.some((k) => {
      if (search.keys.includes(k)) {
        const rowValue = row[k];
        if (typeof rowValue === "string") {
          return rowValue.toLowerCase().includes(search.value.toLowerCase());
        }

        if (typeof rowValue === "number") {
          return rowValue === Number(search.value);
        }

        return true;
      }
    });
  });
};
