import axios from "axios";

export const api = axios.create({
  baseURL: "/",
});

api.interceptors.request.use(
  config => {

    const currentUser = JSON.parse(
      localStorage.getItem(
        "currentUser"
      ) ?? "{}"
    );

    if (currentUser.tenantId) {

      config.headers[
        "X-Tenant-Id"
      ] = currentUser.tenantId;

    }

    if (
      currentUser.roles?.length > 0
    ) {

      config.headers[
        "X-Role"
      ] = currentUser.roles[0];

    }

    return config;
  }
);