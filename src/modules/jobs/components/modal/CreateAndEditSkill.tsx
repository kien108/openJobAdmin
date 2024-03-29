import React, { FC, ReactNode, useEffect, useState } from "react";

import {
   Button,
   Input,
   openNotification,
   OptionType,
   Select,
   Switch,
   Table,
} from "../../../../libs/components";

import {
   GroupButton,
   StyledCreateAndEditMajor,
   StyledExtendOption,
   StyledNotFound,
} from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";
import {
   useCreateSkillMutation,
   useCreateSpecializationMutation,
   useGetMajorsQuery,
   useGetSpecializationsByIdQuery,
   useGetSpecializationsQuery,
   useUpdateMajorMutation,
   useUpdateSkillMutation,
   useUpdateSpecializationMutation,
} from "../../services";

import { useDebounce, useGetAdminByIdQuery } from "../../../../libs/common";
import { useParams, useSearchParams } from "react-router-dom";
import Avatar from "react-avatar";
import { randomColor } from "../../../../utils";

import { v4 as uuidv4 } from "uuid";
import useFilter from "../../hooks/useFilter";
import { update } from "lodash";

interface ICreateAndEditAdmin {
   skill?: any;
   handleClose: () => void;
}

const CreateAndEditSkill: FC<ICreateAndEditAdmin> = ({ handleClose, skill }) => {
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();
   const { id } = useParams();

   const [options, setOptions] = useState<OptionType[]>([]);
   const [message, setMessage] = useState<string | undefined>(undefined);
   const [isEdit, setEdit] = useState<boolean>(false);

   const {
      data: dataFilterSpec,
      isLoading: loadingFilterSpec,
      isFetching: fetchingFilterSpec,
   } = useGetSpecializationsQuery(
      {},
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const [createSkill, { isLoading: loadingCreate }] = useCreateSkillMutation();
   const [updateSkill, { isLoading: loadingUpdate }] = useUpdateSkillMutation();

   const form = useForm({
      defaultValues: {
         name: (skill && skill.name) || "",
      },
      resolver: yupResolver(
         yup.object({
            name: yup.string().trim().required("Trường này không được để trống!"),
         })
      ),
   });

   useEffect(() => {
      const options = (dataFilterSpec ?? []).map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => item.name,
      }));

      setOptions(options);
   }, [dataFilterSpec]);
   const onSubmit = (data: any) => {
      skill
         ? updateSkill({
              name: data.name,
              id: skill?.id,
              //   isVerified: true,
           })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Create major successfully"),
                 });
                 handleClose();
              })
              .catch((error) => {
                 openNotification({
                    type: "error",
                    message: t("common:ERRORS.SERVER_ERROR"),
                 });
              })
         : createSkill({
              specializationId: data?.specializationId,
              skill: {
                 name: data.name,
                 isVerified: true,
              },
           })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Create skill successfully"),
                 });
                 handleClose();
              })
              .catch((error) => {
                 openNotification({
                    type: "error",
                    message: t("common:ERRORS.SERVER_ERROR"),
                 });
              });
   };

   return (
      <Spin spinning={loadingFilterSpec}>
         <StyledCreateAndEditMajor>
            <FormProvider {...form}>
               {!skill && (
                  <Select
                     name="specializationId"
                     title="Chuyên môn"
                     required
                     style={{ fontWeight: "400" }}
                     options={options || []}
                     placeholder="Chọn chuyên môn"
                  />
               )}
               <Input required label={"Tên kỹ năng"} name="name" placeholder="Nhập tên kỹ năng" />

               <GroupButton>
                  <Button
                     loading={loadingCreate || loadingUpdate}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit(onSubmit)();
                     }}
                  >
                     Lưu
                  </Button>
                  <Button
                     onClick={() => {
                        handleClose();
                     }}
                     border="outline"
                  >
                     Hủy bỏ
                  </Button>
               </GroupButton>
            </FormProvider>
         </StyledCreateAndEditMajor>
      </Spin>
   );
};

export default CreateAndEditSkill;
