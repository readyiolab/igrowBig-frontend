export const protect = (route, Protector) => ({
  ...route,
  element: <Protector>{route.element}</Protector>,
});