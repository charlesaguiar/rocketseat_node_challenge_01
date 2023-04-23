import { randomUUID } from "node:crypto";
import { ServerResponse } from "node:http";

import { Database } from "@/database/database";
import { TaskDto } from "@/dtos/task";
import { Task } from "@/models/task";
import { RequestHandler, RequestWithParams } from "@/types/server";
import { getIsoDate } from "@/utils/date";
import { insertFromCsv } from "@/utils/insert-from-csv";
import { ValidateRequest } from "@/guards/validation/decorators";
import { TaskValidator } from "@/guards/validation/validators/task-validator";

interface ITaskController {
  getAllTasks: RequestHandler;
  createTask: RequestHandler;
  createTasksFromStaticFile: RequestHandler;
  updateTask: RequestHandler;
  toggleTaskCompletion: RequestHandler;
  deleteTask: RequestHandler;
}

export class TaskController implements ITaskController {
  #domain = "tasks";
  private database: Database<Task>;

  constructor() {
    this.database = new Database(this.#domain);
  }

  getAllTasks: RequestHandler = (req, res) => {
    const { search } = req.query;
    const tasks = this.database.select({
      value: search,
      keys: ["title", "description"],
    });
    return res.end(JSON.stringify(tasks));
  };

  getTasksCount: RequestHandler = (_, res) => {
    const tasksCount = this.database.count();
    return res.end(JSON.stringify(tasksCount));
  };

  @ValidateRequest(new TaskValidator())
  createTask(req: RequestWithParams, res: ServerResponse) {
    const { title, description } = req.body as TaskDto;

    const task: Task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: getIsoDate(),
      updated_at: null,
    };

    this.database.insert(task);
    return res.writeHead(201).end();
  }

  createTasksFromStaticFile: RequestHandler = async (_, res) => {
    await insertFromCsv();
    return res.writeHead(201).end();
  };

  updateTask: RequestHandler = (req, res) => {
    const { id } = req.params;

    if (!this.database.selectById(id)) {
      return res
        .writeHead(400)
        .end(JSON.stringify({ error: "Specified task does not exist." }));
    }

    const { title, description } = req.body as TaskDto;
    this.database.update(id, { title, description, updated_at: getIsoDate() });
    res.writeHead(204).end();
  };

  toggleTaskCompletion: RequestHandler = (req, res) => {
    const { id } = req.params;
    const task = this.database.selectById(id);

    if (!task) {
      return res
        .writeHead(404)
        .end({ error: "Specified task does not exist." });
    }

    this.database.update(id, {
      ...task,
      completed_at: task.completed_at ? null : getIsoDate(),
      updated_at: getIsoDate(),
    });
    res.writeHead(204).end();
  };

  deleteTask: RequestHandler = (req, res) => {
    const { id } = req.params;

    if (!this.database.selectById(id)) {
      return res
        .writeHead(400)
        .end(JSON.stringify({ error: "Specified task does not exist." }));
    }

    this.database.delete(id);
    res.writeHead(204).end();
  };
}
