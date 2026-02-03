function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname += `/${pathSegments.resource}`;
  }

  if (pathSegments.id) {
    pathname += '/:id';
  }

  return pathname || '/';
}

export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  return constructRouteFromSegments(extractPathnameSegments(pathname));
}

export function parseActivePathname() {
  return extractPathnameSegments(getActivePathname());
}
