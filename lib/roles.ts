export type AppRole = "admin" | "editor" | "operator" | "agency" | "customer";

/** Where a signed-in user should land after login, or when kicked out of a portal they can't access. */
export function roleHomePath(role: AppRole | string): string {
  switch (role) {
    case "admin":
    case "editor":
      return "/admin";
    case "operator":
      return "/provider";
    case "agency":
      return "/agency";
    default:
      return "/";
  }
}
