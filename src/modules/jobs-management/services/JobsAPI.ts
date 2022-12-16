import { createApi } from "@reduxjs/toolkit/query/react";
import { ICompanies, IHr, IHrs } from "../types";
import { baseQuery } from "./baseQuery";

export const JobsAPI = createApi({
   reducerPath: "JobsAPI",
   tagTypes: ["JOBS", "COMPANY_JOBS"],
   baseQuery,
   endpoints: (builder) => ({
      getJobs: builder.query<any, any>({
         query: (params) => ({
            url: "/jobs",
            params,
         }),
         providesTags: ["JOBS"],
      }),
      getCompanyJobs: builder.query<any, any>({
         query: ({ company, ...params }) => ({
            url: `/job/by-company/${company}`,
            params,
         }),
         providesTags: ["COMPANY_JOBS"],
      }),
      getCompanies: builder.query<any, any>({
         query: (params) => ({
            url: "/companies",
            params,
         }),
         // providesTags: ["COMPANY"],
      }),
      getJobById: builder.query<any, string>({
         query: (id) => ({
            url: `/job/${id}`,
         }),
      }),
   }),
});

export const { useGetCompanyJobsQuery, useGetJobsQuery, useGetCompaniesQuery, useGetJobByIdQuery } =
   JobsAPI;
