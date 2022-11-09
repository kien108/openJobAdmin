import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { HrAPI } from "../services";

const rootReducer = combineReducers({
   [HrAPI.reducerPath]: HrAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(HrAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
