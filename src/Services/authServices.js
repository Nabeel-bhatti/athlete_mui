import http from "./httpService";
import config from "./config.json";
import { getAuthToken } from "../util/auth";

const apiEndpoint = config.apiUrl;

export function postCredentials(userData, mode) {
  return http.post(
    apiEndpoint + "/" + mode,
    { ...userData },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
export function logout() {
  return http.post(apiEndpoint + "/logout", {
    headers: {
      Authorization: "Bearer " + getAuthToken(),
      // Accept: "application/json",
      // "Content-Type": "application/json",
    },
  });
}
