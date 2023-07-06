import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const AnalyticsAPI = createApi({
   reducerPath: "AnalyticsAPI",
   baseQuery,
   endpoints: (builder) => ({
      getAnalyticJobs: builder.query({
         query: (params) => ({
            url: `/statistics/job`,
            params,
         }),
      }),
      getAnalyticCVs: builder.query({
         query: (params) => ({
            url: `/statistics/cv-company`,
            params,
         }),
      }),
      getAnalyticUsers: builder.query({
         query: (params) => ({
            url: `/statistics/user`,
            params,
         }),
      }),
      getAnalyticIncome: builder.query({
         query: (params) => ({
            url: `/statistics/income`,
            params,
         }),
      }),
      getCompanies: builder.query<any, any>({
         query: (params) => ({
            url: "/companies",
            params,
         }),
      }),
   }),
});

export const {
   useGetAnalyticJobsQuery,
   useGetAnalyticCVsQuery,
   useGetAnalyticUsersQuery,
   useGetAnalyticIncomeQuery,
   useGetCompaniesQuery,
} = AnalyticsAPI;
