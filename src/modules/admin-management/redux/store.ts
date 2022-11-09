import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AdminAPI } from "../services";

const rootReducer = combineReducers({
   [AdminAPI.reducerPath]: AdminAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(AdminAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
