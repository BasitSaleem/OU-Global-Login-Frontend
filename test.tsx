/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "@/lib/requestFunction";

export interface Merchant {
  mid: string; // Merchant ID
  name: string; // Merchant name
  opened: string; // Date merchant opened (MM/DD/YYYY)
  closed: string | null; // Date merchant closed, or null
  created: string; // Date created in system (ISO string)
  modified: string; // Last modified date (ISO string)
  first_batch: string | null; // First batch date, or null
  last_batch: string | null; // Last batch date, or null
  group: string; // Merchant group
  processor: string; // Processor name
  datasource: string | null; // Data source, can be null
  sic_code: string; // SIC code (string, may be empty)
  vim: string; // “Yes” or “No”
  deactivated: string | null; // Deactivation date or null
  status: string; // Merchant status ("Open", etc.)
  active: string; // “Yes” or “No”
  leads: number[]; // Array of lead IDs
}

export interface MerchantDetails {
  general: {
    mid: string;
    name: string;
    opened: string;
    closed: string | null;
    created: string;
    modified: string;
    first_batch: string | null;
    last_batch: string | null;
    group: string;
    processor: string;
    datasource: string | null;
    sic_code: string;
    vim: string;
    deactivated: string | null;
    status: string;
    active: string;
  };
  account_information: Record<string, unknown>;
  leads: number[];
}

export interface MerchantListResponse {
  data: Merchant[];
}
const MERCHANTS_BASE = "/proxy/merchants";

// GET ALL MERCHNATS
export const fetchMerchants = createAsyncThunk<
  Merchant[],
  { page?: number; perPage?: number } | void,
  { rejectValue: string }
>("fetch/AllMerchants", async (args, { rejectWithValue }) => {
  try {
    const page = args?.page ?? 1;
    const perPage = args?.perPage ?? 25;
    const url = `${MERCHANTS_BASE}?page=${page}&perPage=${perPage}`;
    const res = await request<MerchantListResponse>(url, "GET");

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Failed to fetch merchants");
  }
});

// CREATE MERCHNAT

export const createMerchant = createAsyncThunk<
  unknown,
  { data: any; isFormData?: boolean },
  { rejectValue: string }
>("create/Merchant", async ({ data, isFormData }, { rejectWithValue }) => {
  try {
    const res = await request<unknown>(
      MERCHANTS_BASE,
      "POST",
      data,
      !!isFormData
    );
    return res;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Failed to create merchant");
  }
});

/** details by mid */
export const getMerchantDetails = createAsyncThunk<
  MerchantDetails,
  { mid: string },
  { rejectValue: string }
>("details/Merchant", async ({ mid }, { rejectWithValue }) => {
  try {
    const res = await request<MerchantDetails>(
      `${MERCHANTS_BASE}/${mid}`,
      "GET"
    );
    return res;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Failed to fetch merchant details");
  }
});

//UPDATE MERCHANT
export const updateMerchant = createAsyncThunk<
  unknown,
  { mid: string; data: any; isFormData?: boolean },
  { rejectValue: string }
>("update/Merchant", async ({ mid, data }, { rejectWithValue }) => {
  try {
    const res = await request<unknown>(
      `${MERCHANTS_BASE}/${mid}`,
      "PATCH",
      {},
      data
    );
    return res;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Failed to update merchant");
  }
});

// USERS FOR MERCHANT
export const getMerchantUsers = createAsyncThunk<
  unknown[],
  { mid: string },
  { rejectValue: string }
>("users/Merchant", async ({ mid }, { rejectWithValue }) => {
  try {
    const res = await request<unknown[]>(
      `${MERCHANTS_BASE}/${mid}/users`,
      "GET"
    );
    return res;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Failed to fetch merchant users");
  }
});

//EQUEPMENMTS FOR MERCHANTSI
export const getMerchantEquipment = createAsyncThunk<
  unknown[],
  { mid: string },
  { rejectValue: string }
>("equipment/Merchant", async ({ mid }, { rejectWithValue }) => {
  try {
    const res = await request<unknown[]>(
      `${MERCHANTS_BASE}/${mid}/equipment`,
      "GET"
    );
    return res;
  } catch (err: any) {
    return rejectWithValue(
      err?.message ?? "Failed to fetch merchant equipment"
    );
  }
});

//IMPORT TRANSCTIONS
export const importTransactions = createAsyncThunk<
  unknown,
  { mid: string; data: any; isFormData?: boolean },
  { rejectValue: string }
>(
  "transactions/MerchantImport",
  async ({ mid, data, isFormData }, { rejectWithValue }) => {
    try {
      const res = await request<unknown>(
        `${MERCHANTS_BASE}/${mid}/transactions`,
        "POST",

        data,
        !!isFormData
      );
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to import transactions");
    }
  }
);

// IMPORT ADJUSTMENTS

export const importAdjustments = createAsyncThunk<
  unknown,
  { mid: string; data: any; isFormData?: boolean },
  { rejectValue: string }
>(
  "adjustments/MerchantImport",
  async ({ mid, data, isFormData }, { rejectWithValue }) => {
    try {
      const res = await request<unknown>(
        `${MERCHANTS_BASE}/${mid}/adjustments`,
        "POST",

        data,
        !!isFormData
      );
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to import adjustments");
    }
  }
);

type IdMap<T> = Record<string, T | undefined>;

interface MerchantsState {
  list: Merchant[];
  byId: IdMap<MerchantDetails>;
  usersByMid: IdMap<unknown[]>;
  equipmentByMid: IdMap<unknown[]>;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  importingTransactions: boolean;
  importingAdjustments: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

const initialState: MerchantsState = {
  list: [],
  byId: {},
  usersByMid: {},
  equipmentByMid: {},
  loading: false,
  creating: false,
  updating: false,
  importingTransactions: false,
  importingAdjustments: false,
  error: null,
  lastFetchedAt: null,
};

const merchantsSlice = createSlice({
  name: "merchants",
  initialState,
  reducers: {
    clearMerchantsError(state) {
      state.error = null;
    },
    clearMerchantDetails(state, action: PayloadAction<{ mid: string }>) {
      const { mid } = action.payload;
      delete state.byId[mid];
      delete state.usersByMid[mid];
      delete state.equipmentByMid[mid];
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchMerchants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchMerchants.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch merchants";
      })

      // create
      .addCase(createMerchant.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createMerchant.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createMerchant.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as string) ?? "Failed to create merchant";
      })

      // details
      .addCase(getMerchantDetails.pending, (state) => {
        state.error = null;
      })
      .addCase(getMerchantDetails.fulfilled, (state, action) => {
        const details = action.payload;
        state.byId[details.general.mid] = details;

        const idx = state.list.findIndex((m) => m.mid === details.general.mid);
        if (idx !== -1) {
          state.list[idx] = {
            ...state.list[idx],
            ...details.general,
            leads: details.leads,
          };
        }
      })
      .addCase(getMerchantDetails.rejected, (state, action) => {
        state.error =
          (action.payload as string) ?? "Failed to fetch merchant details";
      })

      // update
      .addCase(updateMerchant.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateMerchant.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateMerchant.rejected, (state, action) => {
        state.updating = false;
        state.error = (action.payload as string) ?? "Failed to update merchant";
      })

      // users
      .addCase(getMerchantUsers.pending, (state) => {
        state.error = null;
      })
      .addCase(getMerchantUsers.fulfilled, (state, action) => {
        const { arg } = action.meta;
        state.usersByMid[arg.mid] = action.payload as unknown[];
      })
      .addCase(getMerchantUsers.rejected, (state, action) => {
        state.error =
          (action.payload as string) ?? "Failed to fetch merchant users";
      })

      // equipment
      .addCase(getMerchantEquipment.pending, (state) => {
        state.error = null;
      })
      .addCase(getMerchantEquipment.fulfilled, (state, action) => {
        const { arg } = action.meta;
        state.equipmentByMid[arg.mid] = action.payload as unknown[];
      })
      .addCase(getMerchantEquipment.rejected, (state, action) => {
        state.error =
          (action.payload as string) ?? "Failed to fetch merchant equipment";
      })

      // import transactions
      .addCase(importTransactions.pending, (state) => {
        state.importingTransactions = true;
        state.error = null;
      })
      .addCase(importTransactions.fulfilled, (state) => {
        state.importingTransactions = false;
      })
      .addCase(importTransactions.rejected, (state, action) => {
        state.importingTransactions = false;
        state.error =
          (action.payload as string) ?? "Failed to import transactions";
      })

      // import adjustments
      .addCase(importAdjustments.pending, (state) => {
        state.importingAdjustments = true;
        state.error = null;
      })
      .addCase(importAdjustments.fulfilled, (state) => {
        state.importingAdjustments = false;
      })
      .addCase(importAdjustments.rejected, (state, action) => {
        state.importingAdjustments = false;
        state.error =
          (action.payload as string) ?? "Failed to import adjustments";
      });
  },
});

export const { clearMerchantsError, clearMerchantDetails } =
  merchantsSlice.actions;
export default merchantsSlice.reducer;

/** selectors */
export const selectMerchantsLoading = (s: { merchants: MerchantsState }) =>
  s.merchants.loading;
export const selectMerchantsError = (s: { merchants: MerchantsState }) =>
  s.merchants.error;
export const selectMerchantsList = (s: { merchants: MerchantsState }) =>
  s.merchants.list;
export const selectMerchantDetails =
  (mid: string) => (s: { merchants: MerchantsState }) =>
    s.merchants.byId[mid];
export const selectMerchantUsers =
  (mid: string) => (s: { merchants: MerchantsState }) =>
    s.merchants.usersByMid[mid] ?? [];
export const selectMerchantEquipment =
  (mid: string) => (s: { merchants: MerchantsState }) =>
    s.merchants.equipmentByMid[mid] ?? [];









  import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  id: string;
  username: string;
};
type LoginState = {
  LoginUserDetail: {
    user: User;
    isUserLogin: boolean;
  };
};

const initialState: LoginState = {
  LoginUserDetail: {
    user: {
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "ref",
      id: "",
      username: "",
    },
    isUserLogin: false,
  },
};

const LoginUserDetail = createSlice({
  name: "LoginUserDetail",
  initialState,
  reducers: {
    saveLoginUserDetailReducer: (state, action: PayloadAction<User>) => {
      state.LoginUserDetail = {
        user: action.payload,
        isUserLogin: true,
      };
    },
    emptyUserDetailReducer: (state) => {
      state.LoginUserDetail = {
        user: {
          name: "",
          email: "",
          role: "",
          id: "",
          username: "",
          firstName: "",
          lastName: "",
        },
        isUserLogin: false,
      };
    },
  },
});

export const { saveLoginUserDetailReducer, emptyUserDetailReducer } =
  LoginUserDetail.actions;
export default LoginUserDetail.reducer;
