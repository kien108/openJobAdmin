export {
   AdminAPI,
   useGetAdminsQuery,
   useCreateAdminMutation,
   useCheckUsernameMutation,
   useGetByIdQuery,
   useCheckPasswordMutation,
   useUpdateAdminMutation,
   useDeleteAdminMutation,
   useEditPasswordMutation,
   useGetCompaniesQuery,
} from "./AdminAPI";

export {
   MajorAPI,
   useGetMajorsQuery,
   useCreateMajorMutation,
   useUpdateMajorMutation,
   useDeleteMajorMutation,
} from "./MajorAPI";

export {
   SpecializationAPI,
   useGetSpecializationsQuery,
   useCreateSpecializationMutation,
   useUpdateSpecializationMutation,
   useDeleteSpecializationMutation,
   useGetSkillByIdQuery,
   useCreateSkillMutation,
   useUpdateSkillMutation,
   useDeleteSkillMutation,
   useGetSkillInvalidateQuery,
   useValidateSkillMutation,
} from "./SpecializationAPI";
