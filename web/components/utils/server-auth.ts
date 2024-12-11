import { cookies } from "next/headers";

export function isLoggedIn(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get("goat-pen-token");
  return !!token;
}
