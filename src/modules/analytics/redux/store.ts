import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AnalyticsAPI } from "../services";

const rootReducer = combineReducers({
   [AnalyticsAPI.reducerPath]: AnalyticsAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(AnalyticsAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
