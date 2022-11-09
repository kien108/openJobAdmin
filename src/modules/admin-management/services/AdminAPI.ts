import { createApi } from "@reduxjs/toolkit/query/react";
import { IAdmin, IAdminDetail } from "../types";
import { baseQuery } from "./baseQuery";

export const AdminAPI = createApi({
   reducerPath: "AdminAPI",
   tagTypes: ["ADMIN"],
   baseQuery,
   endpoints: (builder) => ({
      getCompanies: builder.query<any, any>({
         query: (params) => ({
            url: "/companies",
            params,
         }),
         // providesTags: ["COMPANY"],
      }),
      getAdmins: builder.query<IAdmin, any>({
         query: (params) => ({
            url: "/adminusers",
            params,
         }),
         providesTags: ["ADMIN"],
      }),
      getById: builder.query<IAdminDetail, string>({
         query: (id) => ({
            url: `/adminuser/${id}`,
         }),
      }),
      createAdmin: builder.mutation<any, any>({
         query: (body) => ({
            url: "/adminuser/create",
            body,
            method: "POST",
         }),
         invalidatesTags: ["ADMIN"],
      }),
      updateAdmin: builder.mutation<any, any>({
         query: (body) => ({
            url: "/adminuser/update",
            body,
            method: "POST",
         }),
         invalidatesTags: ["ADMIN"],
      }),
      deleteAdmin: builder.mutation<any, string>({
         query: (id) => ({
            url: `/adminuser/deactivate/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["ADMIN"],
      }),
      checkUsername: builder.mutation<string, any>({
         query: (body) => ({
            url: "/adminuser/check-username",
            body,
            method: "POST",
         }),
      }),
      checkPassword: builder.mutation<string, any>({
         query: (body) => ({
            url: "/adminuser/check-password",
            body,
            method: "POST",
         }),
      }),
      editPassword: builder.mutation<string, any>({
         query: (body) => ({
            url: "/adminuser/change-password",
            body,
            method: "POST",
         }),
      }),
   }),
});

export const {
   useGetAdminsQuery,
   useCreateAdminMutation,
   useCheckUsernameMutation,
   useGetByIdQuery,
   useCheckPasswordMutation,
   useUpdateAdminMutation,
   useDeleteAdminMutation,
   useEditPasswordMutation,
   useGetCompaniesQuery,
} = AdminAPI;
