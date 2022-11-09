import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { WebUserAPI } from "../services";

const rootReducer = combineReducers({
   [WebUserAPI.reducerPath]: WebUserAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(WebUserAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
