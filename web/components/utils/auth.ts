import Cookies from "js-cookie";

export const isLoggedIn = (): any => {
  if (typeof window === "undefined") {
    return false; // Ensure it returns false on the server
  }
  const token = Cookies.get("goat-pen-token");
  return token;
};
