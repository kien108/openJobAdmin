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
   useCreateSpecializationMutation,
   useGetMajorsQuery,
   useUpdateMajorMutation,
   useUpdateSpecializationMutation,
} from "../../services";

import { useDebounce, useGetAdminByIdQuery } from "../../../../libs/common";
import { useSearchParams } from "react-router-dom";
import Avatar from "react-avatar";
import { randomColor } from "../../../../utils";

import { v4 as uuidv4 } from "uuid";
import useFilter from "../../hooks/useFilter";
import { update } from "lodash";

interface ICreateAndEditAdmin {
   specialization?: any;
   handleClose: () => void;
}

const CreateAndEditMajor: FC<ICreateAndEditAdmin> = ({ handleClose, specialization }) => {
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();

   const [options, setOptions] = useState<OptionType[]>([]);
   const [message, setMessage] = useState<string | undefined>(undefined);
   const [isEdit, setEdit] = useState<boolean>(false);

   const {
      data: dataMajors,
      isLoading: loadingMajors,
      isFetching: fetchingMajors,
   } = useGetMajorsQuery({});

   const [createSpecialization, { isLoading: loadingCreate }] = useCreateSpecializationMutation();
   const [updateSpecialization, { isLoading: loadingUpdate }] = useUpdateSpecializationMutation();

   const form = useForm({
      defaultValues: {
         name: (specialization && specialization.name) || "",
         major_id: "",
      },
      resolver: yupResolver(
         yup.object({
            name: yup.string().trim().required("Trường này không được để trống!"),
            major_id: !specialization
               ? yup.string().trim().required("Trường này không được để trống!")
               : yup.string(),
         })
      ),
   });

   useEffect(() => {
      if (!dataMajors) return;

      const options = dataMajors.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => item.name,
      }));

      setOptions(options);
   }, [dataMajors]);
   const onSubmit = (data: any) => {
      specialization
         ? updateSpecialization({
              name: data.name,
              id: specialization?.id,
           })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Cập nhật chuyên môn thành công"),
                 });
                 handleClose();
              })
              .catch((error) => {
                 openNotification({
                    type: "error",
                    message: t("common:ERRORS.SERVER_ERROR"),
                 });
              })
         : createSpecialization({
              majorId: data.major_id,
              specialization: {
                 name: data.name,
              },
           })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Tạo mới chuyên môn thành công"),
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
      <Spin spinning={false}>
         <StyledCreateAndEditMajor>
            <FormProvider {...form}>
               {!specialization && (
                  <Select
                     options={options}
                     name="major_id"
                     required
                     title={t("Chuyên ngành")}
                     style={{ fontWeight: "400" }}
                     placeholder="Chọn chuyên ngành"
                  />
               )}
               <Input
                  required
                  label={t("Tên chuyên môn")}
                  name="name"
                  placeholder={t("Enter specialization name...")}
               />
               <GroupButton>
                  <Button
                     loading={loadingCreate || loadingUpdate}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit(onSubmit)();
                     }}
                  >
                     {t("common:confirm.save")}
                  </Button>
                  <Button
                     onClick={() => {
                        handleClose();
                        searchParams.delete("id");
                        setSearchParams(searchParams);
                     }}
                     border="outline"
                  >
                     {t("common:confirm.cancel")}
                  </Button>
               </GroupButton>
            </FormProvider>
         </StyledCreateAndEditMajor>
      </Spin>
   );
};

export default CreateAndEditMajor;
