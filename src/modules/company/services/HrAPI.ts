import { createApi } from "@reduxjs/toolkit/query/react";
import { ICompanies, IHr, IHrs } from "../types";
import { baseQuery } from "./baseQuery";

export const HrAPI = createApi({
   reducerPath: "HrAPI",
   tagTypes: ["COMPANY", "HRS"],
   baseQuery,
   endpoints: (builder) => ({
      getCompanies: builder.query<ICompanies, any>({
         query: (params) => ({
            url: "/companies",
            params,
         }),
         providesTags: ["COMPANY"],
      }),
      getHrs: builder.query<IHrs, any>({
         query: (params) => ({
            url: "/hrs",
            params,
         }),
         providesTags: ["HRS"],
      }),
      getById: builder.query<IHr, string>({
         query: (id) => ({
            url: `company/${id}/hr`,
         }),
      }),
      createHeadHunter: builder.mutation<any, any>({
         query: (body) => ({
            url: "/company/create",
            body,
            method: "POST",
         }),
         invalidatesTags: ["COMPANY"],
      }),
      updateHr: builder.mutation<any, any>({
         query: (body) => ({
            url: `/company/${body.company.id}/hr/update?updatePassword=${body.updatePassword}`,
            body,
            method: "POST",
         }),
         invalidatesTags: ["COMPANY"],
      }),
      activate: builder.mutation<any, string>({
         query: (id) => ({
            url: `/hr/activate/${id}`,
            method: "POST",
         }),
         invalidatesTags: ["COMPANY"],
      }),
      deActivate: builder.mutation<any, string>({
         query: (id) => ({
            url: `/company/${id}/delete`,
            method: "DELETE",
         }),
         invalidatesTags: ["COMPANY"],
      }),
   }),
});

export const {
   useGetCompaniesQuery,
   useGetHrsQuery,
   useCreateHeadHunterMutation,
   useGetByIdQuery,
   useActivateMutation,
   useDeActivateMutation,
   useUpdateHrMutation,
} = HrAPI;
