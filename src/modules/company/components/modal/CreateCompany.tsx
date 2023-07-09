import React, { FC, ReactNode, useEffect, useState } from "react";

import {
   Button,
   Input,
   openNotification,
   OptionType,
   Select,
   Switch,
} from "../../../../libs/components";

import { GroupButton, StyledCreateAndEditHr, StyledExtendOption, StyledNotFound } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";
import {
   useActivateMutation,
   useCreateHeadHunterMutation,
   useGetByIdQuery,
   useGetCompaniesQuery,
   useUpdateHrMutation,
} from "../../services";

import { useDebounce, useGetAdminByIdQuery } from "../../../../libs/common";
import { useSearchParams } from "react-router-dom";
import Avatar from "react-avatar";
import { randomColor } from "../../../../utils";

import { v4 as uuidv4 } from "uuid";
import { EMemberTypes } from "../../../../types";

interface ICreateAndEditAdmin {
   handleClose: () => void;
}

const CreateAndEditHr: FC<ICreateAndEditAdmin> = ({ handleClose }) => {
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();

   const [message, setMessage] = useState<string | undefined>(undefined);
   const [isEdit, setEdit] = useState<boolean>(false);

   const form = useForm({
      mode: "all",
      defaultValues: {
         firstName: "",
         email: "",
         companyName: "",
         position: "",
         phone: "",
         isActive: true,
      },
      resolver: yupResolver(
         yup.object({
            firstName: yup.string().trim().required("Trường này không được để trống!"),
            companyName: yup.string().trim().required("Trường này không được để trống!"),
            email: yup
               .string()
               .email(t("common:form.email"))
               .required("Trường này không được để trống!"),
            phone: yup.string().required("Trường này không được để trống!"),
            position: yup.string().required("Trường này không được để trống!"),
            isActive: yup.boolean(),
         })
      ),
   });

   const [checkedStatus, setCheckedStatus] = useState<boolean>(form.getValues("isActive"));

   const [createHeadHunter, { isLoading: loadingCreate }] = useCreateHeadHunterMutation();

   const onSubmit = (data: any) => {
      createHeadHunter({
         headHunter: {
            authProvider: "DATABASE",
            email: data.email,
            firstName: data.firstName,
            phone: data?.phone,
            position: data?.position,
            isActive: data.isActive,
            company: {
               memberType: EMemberTypes.DEFAULT,
               isActive: data.isActive,
               name: data?.companyName,
            },
         },
      })
         .unwrap()
         .then(() => {
            openNotification({
               type: "success",
               message: t("Create head hunter successfully!!!"),
            });
            handleClose();
         })
         .catch((error) => {
            console.log({ error: error });
            openNotification({
               type: "error",
               message: t("common:ERRORS.SERVER_ERROR"),
            });
         });
   };

   useEffect(() => {
      setEdit(!!searchParams.get("id"));
   }, [searchParams.get("id")]);

   return (
      <StyledCreateAndEditHr>
         <FormProvider {...form}>
            <Row gutter={[20, 20]}>
               <Col span={24}>
                  <Input
                     disabled={isEdit}
                     label={"Tên công ty"}
                     name="companyName"
                     required
                     placeholder={t("Nhập tên công ty...")}
                  />
               </Col>
               <Col span={12}>
                  <Input
                     required
                     label={"Họ và tên người đại diện"}
                     name="firstName"
                     placeholder={"Nhập họ và tên người đại diện"}
                  />
               </Col>
               <Col span={12}>
                  <Input required label="Chức vụ" name="position" placeholder={"Nhập chức vụ"} />
               </Col>
               <Col span={12}>
                  <Input
                     label={t("Số điện thoại")}
                     name="phone"
                     required
                     placeholder={t("Nhập số điện thoại")}
                  />
               </Col>
               <Col span={12}>
                  <Input
                     label={"Email"}
                     name="email"
                     required
                     placeholder={t("abc@gmail.com")}
                     message={message}
                  />
               </Col>
            </Row>

            <Switch
               label={t("adminManagement.status")}
               checked={checkedStatus}
               onChange={(checked) => {
                  setCheckedStatus(checked);
                  form.setValue("isActive", checked);
               }}
               checkedLabel={t("common:form.active")}
               unCheckedLabel={t("common:form.inActive")}
            />
            <GroupButton>
               <Button
                  loading={loadingCreate}
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
      </StyledCreateAndEditHr>
   );
};

export default CreateAndEditHr;
