import { createApi } from "@reduxjs/toolkit/query/react";
import { IAdmin, IAdminDetail } from "../types";
import { baseQuery } from "./baseQuery";

export const MajorAPI = createApi({
   reducerPath: "MajorAPI",
   tagTypes: ["MAJORS", "ADMIN"],
   baseQuery,
   endpoints: (builder) => ({
      getMajors: builder.query<any, any>({
         query: (params) => ({
            url: "/majors",
            params,
         }),
         providesTags: ["MAJORS"],
      }),

      createMajor: builder.mutation<any, any>({
         query: (body) => ({
            url: "/major/create",
            body,
            method: "POST",
         }),
         invalidatesTags: ["MAJORS"],
      }),
      updateMajor: builder.mutation<any, any>({
         query: (body) => ({
            url: "/major/update",
            body,
            method: "PUT",
         }),
         invalidatesTags: ["MAJORS"],
      }),
      deleteMajor: builder.mutation<any, string>({
         query: (id) => ({
            url: `/major/delete/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["MAJORS"],
      }),
      checkUsername: builder.mutation<string, any>({
         query: (body) => ({
            url: "/adminuser/check-username",
            body,
            method: "POST",
         }),
      }),
   }),
});

export const {
   useGetMajorsQuery,
   useCreateMajorMutation,
   useUpdateMajorMutation,
   useDeleteMajorMutation,
} = MajorAPI;
