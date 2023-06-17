import { createApi } from "@reduxjs/toolkit/query/react";
import { ICompanies, IHr, IHrs } from "../types";
import { baseQuery } from "./baseQuery";
import { IJob, IResJobs } from "../types/JobType";
import { IParamsCommon } from "../../../types";

export const JobsAPI = createApi({
   reducerPath: "JobsAPI",
   tagTypes: ["JOBS", "COMPANY_JOBS"],
   baseQuery,
   endpoints: (builder) => ({
      getJobs: builder.query<IResJobs, IParamsCommon>({
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
      getJobById: builder.query<IJob, string>({
         query: (id) => ({
            url: `/job/${id}`,
         }),
      }),
      getMajors: builder.query({
         query: (params) => ({
            url: "/majors",
            params,
         }),
      }),
      getSpecializations: builder.query({
         query: (id) => ({
            url: `/specializations`,
         }),
      }),
      getProvinces: builder.query({
         query: (params) => ({
            url: "/location/search-province",
            params,
         }),
      }),
   }),
});

export const {
   useGetCompanyJobsQuery,
   useGetJobsQuery,
   useGetCompaniesQuery,
   useGetJobByIdQuery,
   useGetMajorsQuery,
   useGetSpecializationsQuery,
   useGetProvincesQuery,
} = JobsAPI;
