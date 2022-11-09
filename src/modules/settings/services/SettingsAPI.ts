import { createApi } from "@reduxjs/toolkit/query/react";
import { ISetting } from "../types";
import { baseQuery } from "./baseQuery";

export const SettingsAPI = createApi({
   reducerPath: "SettingsAPI",
   tagTypes: ["SETTINGS", "EMAILS"],
   baseQuery,
   endpoints: (builder) => ({
      getSettings: builder.query<ISetting[], any>({
         query: (params) => ({
            url: "/settings",
            params,
         }),
         providesTags: ["SETTINGS"],
      }),
      getByName: builder.query<ISetting, any>({
         query: (name) => ({
            url: `/setting/${name}`,
         }),
      }),
      createAndUpdate: builder.mutation<any, any>({
         query: ({ type, ...body }) => ({
            url: `/setting/${type}`,
            method: "POST",
            body,
         }),
         invalidatesTags: ["SETTINGS"],
      }),
      delete: builder.mutation<any, string>({
         query: (id) => ({
            url: `/setting/delete/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["SETTINGS"],
      }),
   }),
});

export const {
   useGetSettingsQuery,
   useCreateAndUpdateMutation,
   useGetByNameQuery,
   useDeleteMutation,
} = SettingsAPI;
