// path comes like this: /users/:id
export function buildRoutePath(path: string) {
  const routeParamsRegex = /:([a-zA-Z]+)/g;
  const pathWithParams = path.replaceAll(
    routeParamsRegex,
    "(?<$1>[a-z0-9-_]+)"
  );
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);
  return pathRegex;
}
