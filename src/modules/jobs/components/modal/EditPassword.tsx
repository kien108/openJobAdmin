import React, { FC, useState } from "react";

import { Button, Input, openNotification } from "../../../../libs/components";

import { GroupButton, StyledEditPassword } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useGetByIdQuery, useUpdateHrMutation } from "../../services";
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

   const { data: dataAccount, isLoading: loadingAccount } = useGetByIdQuery(id!, {
      skip: !id,
      refetchOnMountOrArgChange: true,
   });

   const [editPassword, { isLoading: loadingEditPassword }] = useUpdateHrMutation();

   const onSubmit = (data: any) => {
      editPassword({ ...dataAccount, password: data.newPassword, updatePassword: true })
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
   );
};

export default EditPassword;
