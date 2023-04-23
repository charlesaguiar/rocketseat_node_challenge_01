import { RequestWithParams } from "@/types/server";

export interface IValidator {
  validate(req: RequestWithParams): boolean;
  getMessage(): string;
}
