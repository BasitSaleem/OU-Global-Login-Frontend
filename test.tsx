/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import LoginUserDetail from "./slice/logInUserDetails.slice";
import loaderReducer from "./slice/loader.slice";
import userReducer from "./slice/user.slice";
import clockReducer from "./slice/clock.slice";
import authReducer from "./slice/auth.slice";
import adminReducer from "./slice/admin.slice";
import metchantReducer from "./slice/merchant.slice";
import helpdeskReducer from "./slice/help-desk.slice"
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
//this create noop storage on the server side which just remv
function createNoopStorage() {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

const isServer = typeof window === "undefined";
const storageEngine = isServer
  ? createNoopStorage()
  : createWebStorage("local");

const rootReducer = combineReducers({
  LoginUserDetail,
  loader: loaderReducer,
  user: userReducer,
  auth: authReducer,
  clock: clockReducer,
  admin: adminReducer,
  merchants: metchantReducer,
   helpdesk: helpdeskReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

// PERSIST CONFIG
const persistConfig = {
  key: "root",
  storage: storageEngine,
  whitelist: ["LoginUserDetail"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// STORE
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
