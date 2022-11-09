import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { SettingsAPI } from "../services";

const rootReducer = combineReducers({
   [SettingsAPI.reducerPath]: SettingsAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SettingsAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
