import React, { FC, useState } from "react";

import { Button, Input, openNotification } from "../../../../libs/components";

import { GroupButton, StyledEditPassword } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useEditPasswordMutation } from "../../services";
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
               .required("Trường này không được để trống!")
               .min(8, t("common:form.passwordLength")),
         })
      ),
   });

   const [message, setMessage] = useState<string | undefined>(undefined);
   const [messagePassword, setMessagePassword] = useState<string | undefined>(undefined);

   const [editPassword, { isLoading: loadingEditPassword }] = useEditPasswordMutation();

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

   return (
      <StyledEditPassword>
         <FormProvider {...form}>
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
                  Lưu
               </Button>
               <Button
                  onClick={() => {
                     handleClose();
                     searchParams.delete("id");
                     setSearchParams(searchParams);
                  }}
                  border="outline"
               >
                  Hủy
               </Button>
            </GroupButton>
         </FormProvider>
      </StyledEditPassword>
   );
};

export default EditPassword;
