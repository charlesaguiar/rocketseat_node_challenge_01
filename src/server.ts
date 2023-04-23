import { createServer } from "node:http";

import { json } from "@/middlewares/json";
import { routes } from "@/router/routes";
import { RequestWithParams } from "@/types/server";
import { extractQueryParams } from "@/utils/extract-query-params";

const server = createServer(async (req, res) => {
  const request = req as RequestWithParams;
  await json(request, res);
  const { method, url } = req;

  const safeUrl = url ?? "/";
  const route = routes.find((r) => r.path.test(safeUrl) && r.method === method);

  if (route) {
    const routeParams = safeUrl.match(route.path);
    const { query, ...params } = routeParams?.groups ?? {};

    request.params = params ?? {};
    request.query = extractQueryParams(query);

    return route.handler(request, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
