import http from "./httpService";
import config from "./config.json";

const apiEndpoint = config.apiUrl + "/publicData";
export function getAthlete(value) {
  return http.get(apiEndpoint + "/athlete", {
    params: {
      ...value,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
export function getTimeRange(value) {
  return http.get(apiEndpoint + "/timeRange", {
    params: {
      ...value,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
export function getGender(value) {
  return http.get(apiEndpoint + "/gender", {
    params: {
      ...value,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
export function getCompetition(value) {
  return http.get(apiEndpoint + "/competition", {
    params: {
      ...value,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
export function getTask(value) {
  return http.get(apiEndpoint + "/tasks", {
    params: {
      ...value,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
export function getEvent(value) {
  return http.get(apiEndpoint + "/events", {
    params: {
      ...value,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
export function getScoreType(value) {
  return http.get(apiEndpoint + "/scoreTypes", {
    params: {
      ...value,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
