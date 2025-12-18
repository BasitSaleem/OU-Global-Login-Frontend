/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const BASE_URL = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_API_BASE_URL : process.env.NEXT_PUBLIC_API_PROD_BASE_URL;
export const request = async <T = any>(
  url: string,
  method: RequestMethod,
  headers?: Record<string, string>,
  data?: any,
  isFormData?: boolean
): Promise<T> => {
  const raw = data?.client_id ? new URL(`${BASE_URL}${url}`) : `${BASE_URL}${url}`;

  let params = {};
  if (data?.client_id) {
    const { client_id, redirect_uri, scope, state, nonce, code_challenge, code_challenge_method, response_type, subdomain } = data;
    if (!client_id || !redirect_uri || !scope || !state || !nonce || !code_challenge || !code_challenge_method || !response_type || !subdomain) {
      params = { client_id, redirect_uri, scope, state, nonce, code_challenge, code_challenge_method, response_type, subdomain };
    }
  }
  const fetchOptions: any = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body:
      data !== undefined && method.toUpperCase() !== "GET"
        ? isFormData
          ? (data as FormData)
          : JSON.stringify(data)
        : undefined,
  };

  if (data?.client_id) {
    raw.search = new URLSearchParams(params).toString();
  }
  console.log(data, isFormData, "this is dataaa");

  if (isFormData) {
    delete (fetchOptions.headers as Record<string, string>)["Content-Type"];
  }

  const response = await fetch(raw, fetchOptions);
  const responseBody = await response.json();
  if (!response.ok) {
    const message =
      (responseBody as any)?.message ||
      response.statusText ||
      "Something went wrong";
    throw new Error(message);
  }
  return responseBody as T;
};
