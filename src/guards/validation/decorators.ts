import { ServerResponse } from "http";

import { RequestWithParams } from "@/types/server";
import { IValidator } from "./interfaces";

export function ValidateRequest(validator: IValidator) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalHandler = descriptor.value;

    descriptor.value = function (req: RequestWithParams, res: ServerResponse) {
      if (validator.validate(req)) {
        originalHandler.bind(this)(req, res);
      } else {
        res
          .writeHead(400)
          .end(JSON.stringify({ error: validator.getMessage() }));
      }
    };

    return descriptor;
  };
}
