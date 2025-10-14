/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const request = async <T = any>(
  url: string,
  method: RequestMethod,
  headers?: Record<string, string>,
  data?: unknown,
  isFormData?: boolean
): Promise<T> => {
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

  if (isFormData) {
    delete (fetchOptions.headers as Record<string, string>)["Content-Type"];
  }

  const response = await fetch(`${BASE_URL}${url}`, fetchOptions);
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
