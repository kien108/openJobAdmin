import React, { FC, ReactNode, useEffect, useState } from "react";

import {
   Button,
   Input,
   openNotification,
   OptionType,
   Select,
   Switch,
} from "../../../../libs/components";

import { GroupButton, StyledCreateAndEditAdmin, StyledEditPassword } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";
import { useCheckPasswordMutation, useEditPasswordMutation } from "../../services";
import { useDebounce } from "../../../../libs/common";
import { useSearchParams } from "react-router-dom";

interface IEditPassword {
   handleClose: () => void;
   id: string | undefined;
}

const EditPassword: FC<IEditPassword> = ({ handleClose, id }) => {
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();

   const form = useForm({
      defaultValues: {
         password: "",
         newPassword: "",
      },
      resolver: yupResolver(
         yup.object({
            password: yup.string(),
            newPassword: yup
               .string()
               .trim()
               .required(t("common:form.required"))
               .min(8, t("common:form.passwordLength")),
         })
      ),
   });

   const [message, setMessage] = useState<string | undefined>(undefined);
   const [messagePassword, setMessagePassword] = useState<string | undefined>(undefined);

   const debouncePassword = useDebounce(form.watch("password"), 500);

   const [checkPassword, { isLoading: loadingCheckPassword }] = useCheckPasswordMutation();
   const [editPassword, { isLoading: loadingEditPassword }] = useEditPasswordMutation();

   const handleCheckPassword = () => {
      id &&
         checkPassword({ id, password: debouncePassword })
            .unwrap()
            .then(() => {
               setMessagePassword(undefined);
            })
            .catch((error) => {
               setMessagePassword(t("adminManagement.notMatch"));
            });
   };

   const onSubmit = (data: any) => {
      editPassword({ id, password: data.newPassword })
         .unwrap()
         .then(() => {
            openNotification({
               type: "success",
               message: t("adminManagement.editPasswordSuccessful"),
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
      if (!debouncePassword) return;

      handleCheckPassword();
   }, [debouncePassword]);

   return (
      <Spin spinning={loadingCheckPassword}>
         <StyledEditPassword>
            <FormProvider {...form}>
               <Input
                  required
                  type="password"
                  label={t("adminManagement.password")}
                  name="password"
                  placeholder={t("adminManagement.enterPassword")}
                  message={messagePassword}
               />
               <Input
                  required
                  type="password"
                  label={t("adminManagement.newPassword")}
                  name="newPassword"
                  placeholder={t("adminManagement.enterNewPassword")}
               />
               <GroupButton>
                  <Button
                     loading={loadingEditPassword}
                     disabled={!!message || !!messagePassword}
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
         </StyledEditPassword>
      </Spin>
   );
};

export default EditPassword;
