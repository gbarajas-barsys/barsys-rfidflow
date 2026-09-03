import axios from "axios";

export const api = axios.create({
  baseURL: "/",
});

export const getReaderStatus =
  async () => {

    const response =
      await fetch(
        "http://localhost:5120/api/readers/status"
      );

    return response.json();
};