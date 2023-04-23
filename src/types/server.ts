import { IncomingMessage, ServerResponse } from "node:http";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestParam<T = unknown> = Record<string, T>;

export type RequestWithParams = IncomingMessage & {
  body: RequestParam;
  params: RequestParam<string>;
  query: RequestParam<string>;
};

export type ControllerAction =
  | ServerResponse<IncomingMessage>
  | Promise<ServerResponse<IncomingMessage>>
  | Promise<void>
  | void;

export type RequestHandler = (
  req: RequestWithParams,
  res: ServerResponse
) => ControllerAction;

export type GuardHandler = (
  req: RequestWithParams,
  res: ServerResponse
) => boolean;

export type Route = {
  method: HttpMethod;
  path: RegExp;
  handler: RequestHandler;
};
