import { AxiosRequestConfig } from "axios";
import { axios } from "../Api";
import { useRef } from "react";

// const instance = axios.create({
//   baseURL: `//${document.domain}:9002/api`,
//   // baseURL: `https://${location.hostname}:9002`,
//   timeout: 10000,
//   withCredentials: true,
//   headers: {
//     "Access-Control-Allow-Origin": "http://127.0.0.1:5173/",
//   },
// });

export default function useRequest<REQ>() {
  const loading = useRef<Boolean>(false);
  async function run<RES>(config: AxiosRequestConfig) {
    loading.current = true;
    try {
      return await axios<any, RES>(config);
    } finally {
      loading.current = false;
    }
  }
  return {
    loading,
    run,
  };
}
