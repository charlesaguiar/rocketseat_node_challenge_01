import { TaskController } from "@/controllers/tasks";
import { Route } from "@/types/server";
import { buildRoutePath } from "@/utils/builld-route-path";

const controller = new TaskController();

export const taskRoutes: Route[] = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => controller.getAllTasks(req, res),
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks/count"),
    handler: (req, res) => controller.getTasksCount(req, res),
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => controller.createTask(req, res),
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks/bulk"),
    handler: (req, res) => controller.createTasksFromStaticFile(req, res),
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => controller.updateTask(req, res),
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => controller.toggleTaskCompletion(req, res),
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => controller.deleteTask(req, res),
  },
];
