import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { BusinessAPI } from "../services";

const rootReducer = combineReducers({
   [BusinessAPI.reducerPath]: BusinessAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(BusinessAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
