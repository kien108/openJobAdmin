import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { IResBusiness } from "../types";

export const BusinessAPI = createApi({
   reducerPath: "BusinessAPI",
   tagTypes: ["BUSINESS"],
   baseQuery,
   endpoints: (builder) => ({
      getBusiness: builder.query<IResBusiness, void>({
         query: () => ({
            url: "/business",
         }),
         providesTags: ["BUSINESS"],
      }),

      updateBusiness: builder.mutation<any, any>({
         query: (body) => ({
            url: `/business`,
            method: "POST",
            body,
         }),
         invalidatesTags: ["BUSINESS"],
      }),
   }),
});

export const { useGetBusinessQuery, useUpdateBusinessMutation } = BusinessAPI;
