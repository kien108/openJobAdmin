import { createApi } from "@reduxjs/toolkit/query/react";
import { ICompanies, IHr, IHrs } from "../types";
import { baseQuery } from "./baseQuery";

export const WebUserAPI = createApi({
   reducerPath: "WebUserAPI",
   tagTypes: ["USERS"],
   baseQuery,
   endpoints: (builder) => ({
      getUsers: builder.query<IHrs, any>({
         query: (params) => ({
            url: "/users",
            params,
         }),
         providesTags: ["USERS"],
      }),
      getById: builder.query<IHr, string>({
         query: (id) => ({
            url: `/user/${id}`,
         }),
      }),
      activate: builder.mutation<any, string>({
         query: (id) => ({
            url: `/user/activate/${id}`,
            method: "POST",
         }),
         invalidatesTags: ["USERS"],
      }),
      deActivate: builder.mutation<any, string>({
         query: (id) => ({
            url: `/user/deactivate/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["USERS"],
      }),
   }),
});

export const { useGetUsersQuery, useGetByIdQuery, useActivateMutation, useDeActivateMutation } =
   WebUserAPI;
