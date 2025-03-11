import { authenticationSlice } from "@Global/Redux/slices/authenticationSlice";
import { exampleSlice } from "@Global/Redux/slices/exampleSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { registrationSlice } from "./slices/registrationSlice";

const persistConfig = {
  key: "registration",
  storage,
  whitelist: ["registration"], // Only persist registration state
};

const persistedRegistrationReducer = persistReducer(
  persistConfig,
  registrationSlice.reducer
);

const store = configureStore({
  reducer: {
    example: exampleSlice.reducer,
    registration: persistedRegistrationReducer,
    authentication: authenticationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for Dispatch and Selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
