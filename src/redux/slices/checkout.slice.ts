import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedAddon {
  addonId: string;
  quantity: number;
}

export interface CheckoutState {
  selectedAddons: SelectedAddon[];
}

const initialState: CheckoutState = {
  selectedAddons: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setSelectedAddons: (state, action: PayloadAction<SelectedAddon[]>) => {
      state.selectedAddons = action.payload;
    },
    updateAddonQuantity: (
      state,
      action: PayloadAction<{ addonId: string; quantity: number }>,
    ) => {
      const { addonId, quantity } = action.payload;
      const existing = state.selectedAddons.find(
        (a) => a.addonId === addonId,
      );
      if (quantity <= 0) {
        state.selectedAddons = state.selectedAddons.filter(
          (a) => a.addonId !== addonId,
        );
      } else if (existing) {
        existing.quantity = quantity;
      } else {
        state.selectedAddons.push({ addonId, quantity });
      }
    },
    removeAddon: (state, action: PayloadAction<string>) => {
      state.selectedAddons = state.selectedAddons.filter(
        (a) => a.addonId !== action.payload,
      );
    },
    clearCheckout: (state) => {
      state.selectedAddons = [];
    },
  },
});

export const {
  setSelectedAddons,
  updateAddonQuantity,
  removeAddon,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
