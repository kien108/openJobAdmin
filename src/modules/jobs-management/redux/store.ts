import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { JobsAPI } from "../services";

const rootReducer = combineReducers({
   [JobsAPI.reducerPath]: JobsAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(JobsAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
