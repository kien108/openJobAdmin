import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const InvoiceAPI = createApi({
   reducerPath: "InvoiceAPI",
   baseQuery,
   endpoints: (builder) => ({
      getHistory: builder.query({
         query: (params) => ({
            url: `/invoice`,
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

export const { useGetHistoryQuery, useGetCompaniesQuery } = InvoiceAPI;
