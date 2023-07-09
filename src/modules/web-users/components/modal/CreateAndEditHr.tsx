import React, { FC, ReactNode, useEffect, useState } from "react";

import { Button, Input, openNotification, Switch } from "../../../../libs/components";

import { GroupButton, StyledCreateAndEditHr, StyledExtendOption, StyledNotFound } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";
import { useActivateMutation, useGetByIdQuery } from "../../services";

import { useSearchParams } from "react-router-dom";
import Avatar from "react-avatar";
import { randomColor } from "../../../../utils";

import { v4 as uuidv4 } from "uuid";

interface ICreateAndEditAdmin {
   handleClose: () => void;
}

const CreateAndEditHr: FC<ICreateAndEditAdmin> = ({ handleClose }) => {
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();

   const [message, setMessage] = useState<string | undefined>(undefined);
   const [isEdit, setEdit] = useState<boolean>(false);

   const form = useForm({
      defaultValues: {
         firstName: "",
         lastName: "",
         email: "",
         companyName: "",
         isActive: true,
      },
      resolver: yupResolver(
         yup.object({
            firstName: isEdit
               ? yup.string()
               : yup.string().trim().required("Trường này không được để trống!"),
            lastName: isEdit
               ? yup.string()
               : yup.string().trim().required("Trường này không được để trống!"),
            companyName: isEdit
               ? yup.string()
               : yup.string().trim().required("Trường này không được để trống!"),
            email: isEdit
               ? yup.string()
               : yup
                    .string()
                    .email(t("common:form.email"))
                    .required("Trường này không được để trống!"),
            isActive: yup.boolean(),
         })
      ),
   });

   const [checkedStatus, setCheckedStatus] = useState<boolean>(form.getValues("isActive"));

   const [activate, { isLoading: loadingUpdate }] = useActivateMutation();

   const { data: dataAccount, isLoading: loadingAccount } = useGetByIdQuery(
      searchParams.get("id")!,
      {
         skip: !searchParams.get("id"),
         refetchOnMountOrArgChange: true,
      }
   );

   const onSubmit = (data: any) => {
      activate(searchParams.get("id")!)
         .unwrap()
         .then(() => {
            openNotification({
               type: "success",
               message: t("Update this account successfully!!!"),
            });
            searchParams.delete("id");
            setSearchParams(searchParams);
            handleClose();
         })
         .catch((error) => {
            openNotification({
               type: "error",
               message: t("common:ERRORS.SERVER_ERROR"),
            });
         });
   };

   useEffect(() => {
      setEdit(!!searchParams.get("id"));
   }, [searchParams.get("id")]);

   useEffect(() => {
      console.log(dataAccount);
      if (!dataAccount) return;

      form.setValue("firstName", dataAccount?.firstName);
      form.setValue("lastName", dataAccount.lastName);
      form.setValue("email", dataAccount.email);
      form.setValue("isActive", dataAccount.isActive);
      form.setValue("companyName", dataAccount.company.name);
      setCheckedStatus(dataAccount.isActive);
   }, [dataAccount]);

   return (
      <Spin spinning={loadingAccount}>
         <StyledCreateAndEditHr>
            <FormProvider {...form}>
               {isEdit && (
                  <Row justify="center" className="avatar">
                     <Avatar
                        size="150"
                        round={true}
                        fgColor="#1b1f3b"
                        color={randomColor({
                           id: uuidv4(),
                           lightness: 80,
                        })}
                        maxInitials={2}
                        src={dataAccount?.avatarUrl}
                        name={dataAccount?.firstName}
                        alt={dataAccount?.firstName}
                     />
                  </Row>
               )}
               <Row gutter={20}>
                  <Col span={12}>
                     <Input
                        disabled={isEdit}
                        required
                        label={t("adminManagement.firstName")}
                        name="firstName"
                        placeholder={t("adminManagement.enterFirstName")}
                     />
                  </Col>
                  <Col span={12}>
                     <Input
                        disabled={isEdit}
                        required
                        label={t("adminManagement.lastName")}
                        name="lastName"
                        placeholder={t("adminManagement.enterLastName")}
                     />
                  </Col>
               </Row>
               <Input
                  disabled={isEdit}
                  label={t("Email")}
                  name="email"
                  required
                  placeholder={t("abc@gmail.com")}
                  message={message}
               />
               <Input
                  disabled={isEdit}
                  label={t("Company")}
                  name="companyName"
                  required
                  placeholder={t("Enter company name...")}
               />

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
                     loading={loadingUpdate}
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
      </Spin>
   );
};

export default CreateAndEditHr;
