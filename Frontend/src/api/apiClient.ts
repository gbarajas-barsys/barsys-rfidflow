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

    const selectedTenantId =
      localStorage.getItem(
        "selectedTenantId"
      );

    config.headers[
      "X-Tenant-Id"
    ] =
      selectedTenantId ??
      currentUser.tenantId;

    if (
      currentUser.roles?.length > 0
    ) {

      config.headers[
        "X-Role"
      ] = currentUser.roles[0];

    }

    if (
      currentUser.displayName
    ) {

      config.headers[
        "X-User-Name"
      ] = currentUser.displayName;

    }

    if (
      currentUser.id
    ) {

      config.headers[
        "X-User-Id"
      ] = currentUser.id;

    }

    return config;
  }
);