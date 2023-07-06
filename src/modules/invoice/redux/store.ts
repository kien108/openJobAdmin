import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { InvoiceAPI } from "../services";

const rootReducer = combineReducers({
   [InvoiceAPI.reducerPath]: InvoiceAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(InvoiceAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
