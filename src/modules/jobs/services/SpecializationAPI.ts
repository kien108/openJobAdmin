import { createApi } from "@reduxjs/toolkit/query/react";
import { IAdmin, IAdminDetail } from "../types";
import { baseQuery } from "./baseQuery";

export const SpecializationAPI = createApi({
   reducerPath: "SpecializationAPI",
   tagTypes: ["SPECIALIZAIONS", "SKILLS", "SKILLS_VERIFY"],
   baseQuery,
   endpoints: (builder) => ({
      getSpecializations: builder.query<any, any>({
         query: (params) => ({
            url: "/specializations",
            params,
         }),
         providesTags: ["SPECIALIZAIONS"],
      }),
      createSpecialization: builder.mutation<any, any>({
         query: (body) => ({
            url: "/specialization/create",
            body,
            method: "POST",
         }),
         invalidatesTags: ["SPECIALIZAIONS"],
      }),
      updateSpecialization: builder.mutation<any, any>({
         query: (body) => ({
            url: "/specialization/update",
            body,
            method: "PUT",
         }),
         invalidatesTags: ["SPECIALIZAIONS"],
      }),
      deleteSpecialization: builder.mutation<any, string>({
         query: (id) => ({
            url: `/specialization/delete/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["SPECIALIZAIONS"],
      }),
      checkUsername: builder.mutation<string, any>({
         query: (body) => ({
            url: "/adminuser/check-username",
            body,
            method: "POST",
         }),
      }),
      getSkillById: builder.query<any, any>({
         query: ({ id, ...params }) => ({
            url: `/skill/byspecialization/${id}`,
            params,
         }),
         providesTags: ["SKILLS"],
      }),
      getSkillInvalidate: builder.query<any, any>({
         query: (params) => ({
            url: `/skills-to-verify`,
            params,
         }),
         providesTags: ["SKILLS_VERIFY"],
      }),
      validateSkill: builder.mutation<any, any>({
         query: (id) => ({
            url: `/verify-skill/${id}`,
            method: "POST",
         }),
         invalidatesTags: ["SKILLS_VERIFY"],
      }),
      createSkill: builder.mutation<any, any>({
         query: (body) => ({
            url: "/skill/create",
            body,
            method: "POST",
         }),
         invalidatesTags: ["SKILLS"],
      }),
      updateSkill: builder.mutation<any, any>({
         query: (body) => ({
            url: "/skill/update",
            body,
            method: "PUT",
         }),
         invalidatesTags: ["SKILLS"],
      }),
      deleteSkill: builder.mutation<any, string>({
         query: (id) => ({
            url: `/skill/delete/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["SKILLS"],
      }),
   }),
});

export const {
   useGetSkillByIdQuery,
   useCreateSkillMutation,
   useUpdateSkillMutation,
   useDeleteSkillMutation,
   useGetSpecializationsQuery,
   useCreateSpecializationMutation,
   useUpdateSpecializationMutation,
   useDeleteSpecializationMutation,
   useGetSkillInvalidateQuery,
   useValidateSkillMutation,
} = SpecializationAPI;
