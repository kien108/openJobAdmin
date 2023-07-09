import React, { FC, ReactNode, useEffect, useState } from "react";

import {
   Button,
   Input,
   openNotification,
   OptionType,
   Select,
   Switch,
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
import { useCreateMajorMutation, useUpdateMajorMutation } from "../../services";

import { useDebounce, useGetAdminByIdQuery } from "../../../../libs/common";
import { useSearchParams } from "react-router-dom";
import Avatar from "react-avatar";
import { randomColor } from "../../../../utils";

import { v4 as uuidv4 } from "uuid";

interface ICreateAndEditAdmin {
   major?: any;
   handleClose: () => void;
}

const CreateAndEditMajor: FC<ICreateAndEditAdmin> = ({ handleClose, major }) => {
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();

   const [message, setMessage] = useState<string | undefined>(undefined);
   const [isEdit, setEdit] = useState<boolean>(false);

   const [createMajor, { isLoading: loadingCreate }] = useCreateMajorMutation();
   const [updateMajor, { isLoading: loadingUpdate }] = useUpdateMajorMutation();

   const form = useForm({
      defaultValues: {
         name: (major && major.name) || "",
      },
      resolver: yupResolver(
         yup.object({
            name: yup.string().trim().required("Trường này không được để trống!"),
         })
      ),
   });

   const onSubmit = (data: any) => {
      major
         ? createMajor({ ...data, id: major?.id })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Cập nhật chuyên ngành thành công"),
                 });
                 handleClose();
              })
              .catch((error) => {
                 openNotification({
                    type: "error",
                    message: t("common:ERRORS.SERVER_ERROR"),
                 });
              })
         : createMajor(data)
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Tạo mới chuyên ngành thành công"),
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
               <Input
                  required
                  label="Chuyên ngành"
                  name="name"
                  placeholder={t("Enter major name...")}
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
