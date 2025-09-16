import authenticationSlice from "@Global/Redux/slices/authenticationSlice";
import exampleSlice from "@Global/Redux/slices/exampleSlice";
import destinyAccountSlice from "@Global/Redux/slices/destinyAccountSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";

// Create and configure store
const store = configureStore({
  reducer: {
    example: exampleSlice,
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
