export type DbData = {
  id: string;
  created_at: string;
  updated_at: string | null;
};

export type SearchCriteria<T> = {
  value: string;
  keys: (keyof T)[];
};
