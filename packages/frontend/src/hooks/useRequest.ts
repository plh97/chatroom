import { AxiosRequestConfig } from "axios";
import { request } from "@/Api";
import { useRef } from "react";

export default function useRequest<REQ>() {
  const loading = useRef<Boolean>(false);
  async function run<RES>(config: AxiosRequestConfig) {
    loading.current = true;
    try {
      return await request<RES>(config);
    } finally {
      loading.current = false;
    }
  }
  return {
    loading,
    run,
  };
}
