"use client";
import { useEffect } from "react";
import { useProductAvailability } from "@/apiHooks.ts/productAccess/productAccess.api";

// Without a package link the form starts on a default product (OI). Once product
// access loads, unselect products this account cannot create, also after Reset.
// A product asked for by a link stays selected so the setup step can explain it.
export function useDropUnavailableProducts(
  productRequested: boolean,
  selectedProducts: string[],
  setSelectedProducts: (products: string[]) => void,
) {
  const access = useProductAvailability();
  useEffect(() => {
    if (productRequested || !access.data) return;
    if (selectedProducts.some((code) => !access.isAvailable(code)))
      setSelectedProducts(
        selectedProducts.filter((code) => access.isAvailable(code)),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productRequested, access.data, selectedProducts]);
}
