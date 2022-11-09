import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AdminAPI, MajorAPI, SpecializationAPI } from "../services";

const rootReducer = combineReducers({
   [AdminAPI.reducerPath]: AdminAPI.reducer,
   [MajorAPI.reducerPath]: MajorAPI.reducer,
   [SpecializationAPI.reducerPath]: SpecializationAPI.reducer,
});
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
         .concat(AdminAPI.middleware)
         .concat(MajorAPI.middleware)
         .concat(SpecializationAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
