import { ServerResponse } from "http";
import { RequestWithParams } from "@/types/server";

export async function json(req: RequestWithParams, res: ServerResponse) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = {};
  }

  res.setHeader("Content-type", "application/json");
}
