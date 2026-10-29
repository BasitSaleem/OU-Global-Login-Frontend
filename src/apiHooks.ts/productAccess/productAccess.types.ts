export type ProductCode = "OI" | "OP" | "OR" | "OM" | "OA" | "OJ";

export interface ProductAvailability {
  product: ProductCode;
  name: string;
  launched: boolean;
  // True when this account may pick the product in Create Organization and Add Product.
  available: boolean;
}

export interface ProductAvailabilityResponse {
  statusCode: number;
  data: { products: ProductAvailability[] };
  message: string;
  success: boolean;
}
