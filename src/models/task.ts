import { DbData } from "@/types/database";

export type Task = DbData & {
  id: string;
  title: string;
  description: string;
  completed_at: string | null;
};
