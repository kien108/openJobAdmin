import { store } from "../redux/store";

export const getToken = () => {
   return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
};

export const setToken = (token: string) => {
   localStorage.getItem("isRemember")
      ? localStorage.setItem("access_token", token)
      : sessionStorage.setItem("access_token", token);
};
