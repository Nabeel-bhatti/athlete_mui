import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}

export const checkAuthLoader = async () => {
  const token = getAuthToken();
  if (!token) {
    toast.error("You are not Authorized Login first", {
      toastId: "authError",
    });
    localStorage.clear();
    return redirect("/login");
  }
  return null;
};
