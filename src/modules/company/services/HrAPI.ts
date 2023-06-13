import { createApi } from "@reduxjs/toolkit/query/react";
import { ICompanies, IHr, IHrs, IUnapproveds } from "../types";
import { baseQuery } from "./baseQuery";
import { AdminAPI } from "./../../jobs/services/AdminAPI";

export const HrAPI = createApi({
   reducerPath: "HrAPI",
   tagTypes: ["COMPANY", "HRS", "UNAPPROVED"],
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
            url: `/company/${body.company.id}/hr/update`,
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
      getProvinces: builder.query({
         query: (params) => ({
            url: "/location/search-province",
            params,
         }),
      }),
      getListDistricts: builder.query({
         query: (params) => ({
            url: "/location/search-district",
            params,
         }),
      }),
      getUnapprovedCompanies: builder.query<IUnapproveds, any>({
         query: (params) => ({
            url: "/company/unapproved",
            params,
         }),
         providesTags: ["UNAPPROVED"],
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
   useGetProvincesQuery,
   useGetListDistrictsQuery,
   useGetUnapprovedCompaniesQuery,
} = HrAPI;
