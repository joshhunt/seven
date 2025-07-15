import authenticationSlice from "@Global/Redux/slices/authenticationSlice";
import exampleSlice from "@Global/Redux/slices/exampleSlice";
import destinyAccountSlice from "@Global/Redux/slices/destinyAccountSlice";
import registrationSlice from "@Global/Redux/slices/registrationSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist only certain fields from registration slice
const registrationPersistConfig = {
  key: "registration",
  storage,
  whitelist: ["someField", "anotherField"],
};

// Create persisted reducers
const persistedRegistrationReducer = persistReducer(
  registrationPersistConfig,
  registrationSlice
);

// Create and configure store
const store = configureStore({
  reducer: {
    example: exampleSlice,
    registration: persistedRegistrationReducer,
    authentication: authenticationSlice,
    destinyAccount: destinyAccountSlice, // <- Don't forget this!
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout your app
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
