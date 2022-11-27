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
         accountBalance: 0,
         reports: 0,
      },
      resolver: yupResolver(
         yup.object({
            firstName: isEdit
               ? yup.string()
               : yup.string().trim().required(t("common:form.required")),
            lastName: isEdit
               ? yup.string()
               : yup.string().trim().required(t("common:form.required")),
            companyName: isEdit
               ? yup.string()
               : yup.string().trim().required(t("common:form.required")),
            email: isEdit
               ? yup.string()
               : yup.string().email(t("common:form.email")).required(t("common:form.required")),
            isActive: yup.boolean(),
            accountBalance: yup
               .number()
               .transform((data) => (!data ? null : data))
               .nullable(),
            reports: yup
               .number()
               .transform((data) => (!data ? null : data))
               .nullable(),
         })
      ),
   });

   const [checkedStatus, setCheckedStatus] = useState<boolean>(form.getValues("isActive"));

   const [createHeadHunter, { isLoading: loadingCreate }] = useCreateHeadHunterMutation();

   const [updateHr, { isLoading: loadingUpdate }] = useUpdateHrMutation();

   const { data: dataAccount, isLoading: loadingAccount } = useGetByIdQuery(
      searchParams.get("id")!,
      {
         skip: !searchParams.get("id"),
         refetchOnMountOrArgChange: true,
      }
   );

   const onSubmit = (data: any) => {
      const { companyName, ...dataBody } = data;

      console.log(dataAccount);
      isEdit
         ? updateHr({
              ...dataAccount,
              ...dataBody,
              updatePassword: false,
              company: { ...dataAccount?.company, accountBalance: dataBody?.accountBalance },
           })
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
              })
         : createHeadHunter({
              companyName,
              headHunter: {
                 authProvider: "DATABASE",
                 company: {
                    accountBalance: data.accountBalance,
                 },
                 email: data.email,
                 firstName: data.firstName,
                 lastName: data.lastName,
                 isActive: data.isActive,
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
                 console.log(error.data.message);

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
      if (!dataAccount) return;

      form.setValue("firstName", dataAccount?.firstName);
      form.setValue("lastName", dataAccount.lastName);
      form.setValue("email", dataAccount.email);
      form.setValue("isActive", dataAccount.isActive);
      form.setValue("companyName", dataAccount.company.name);
      form.setValue("reports", dataAccount.reports);
      form.setValue("accountBalance", dataAccount.company.accountBalance);

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
                        required
                        label={t("adminManagement.firstName")}
                        name="firstName"
                        placeholder={t("adminManagement.enterFirstName")}
                     />
                  </Col>
                  <Col span={12}>
                     <Input
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
               <Row gutter={20}>
                  {isEdit && (
                     <Col span={12}>
                        <Input disabled required label={t("Reports")} name="report" />
                     </Col>
                  )}
                  <Col span={12}>
                     <Input
                        label={t("Account Balance")}
                        name="accountBalance"
                        placeholder={t("Enter account balance...")}
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
         </StyledCreateAndEditHr>
      </Spin>
   );
};

export default CreateAndEditHr;
