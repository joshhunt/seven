import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExampleState {
  value: number;
  status: "idle" | "loading" | "failed";
}

const initialState: ExampleState = {
  value: 0,
  status: "idle",
};

export const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "failed">
    ) => {
      state.status = action.payload;
    },
  },
});

export const { increment, decrement, setStatus } = exampleSlice.actions;
export default exampleSlice.reducer;
