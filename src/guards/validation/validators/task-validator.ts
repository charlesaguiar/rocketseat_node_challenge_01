import { TaskDto } from "@/dtos/task";
import { RequestWithParams } from "@/types/server";

import { IValidator } from "../interfaces";

export class TaskValidator implements IValidator {
  validate(req: RequestWithParams) {
    const { title, description } = req.body as TaskDto;
    return !!(title && description);
  }

  getMessage() {
    return "Task title and description must be informed";
  }
}
