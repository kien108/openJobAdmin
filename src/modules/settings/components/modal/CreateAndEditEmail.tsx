import React, { FC, useEffect, useRef, useState } from "react";

import { Button, Input, openNotification, Switch } from "../../../../libs/components";

import { StyledCreateAndEditEmail, GroupButton } from "./styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { EmailVariables } from "../EmailVariables";
import { ISetting, ITemplateItem } from "../../types";
// import {
//   useAddTemplateMutation,
//   useCheckTemplateNameMutation,
//   useEditTemplateMutation
// } from '../../services/AccountApp';
import { useDebounce } from "../../hooks";
import { useCreateAndUpdateMutation } from "../../services";

interface ICreateAndEditEmail {
   handleClose: () => void;
   selectedEmail: ISetting | undefined;
}

const CreateAndEditEmail: FC<ICreateAndEditEmail> = ({ handleClose, selectedEmail }) => {
   const [message, setMessage] = useState<string | undefined>(undefined);

   const subjectRef = useRef<any>(null);
   const contentRef = useRef<any>(null);

   const [createAndUpdate, { isLoading }] = useCreateAndUpdateMutation();

   const { t } = useTranslation();

   const form = useForm({
      defaultValues: {
         name: selectedEmail && selectedEmail?.name,
         value: "",
      },
      resolver: yupResolver(
         yup.object({
            name: yup.string().trim().required(t("common:form.required")),
            value: yup.string().trim().required(t("common:form.required")),
         })
      ),
   });

   const debounceName = useDebounce(form.watch("name"), 300);

   const handleCheckTemplateName = (name: string | undefined) => {
      // name &&
      //    checkTemplateName({ name })
      //       .unwrap()
      //       .then(() => {
      //          setMessage(undefined);
      //       })
      //       .catch((error) => {
      //          setMessage(t("email.valueExists"));
      //       });
   };

   const formattedMarker = (input: string) => {
      return input
         .replaceAll(
            '<span class="marker" contenteditable="true">﻿<span contenteditable="false">',
            "[["
         )
         .replaceAll("</span>﻿</span>", "]]");
   };

   const onSubmit = (data: any) => {
      if (selectedEmail) {
         const body = {
            ...data,
            id: selectedEmail.id,
            value: formattedMarker(data.value),
         };

         createAndUpdate({ ...body, type: "update" })
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: "Cập nhật email thành công",
               });

               handleClose();
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("common:ERRORS.SERVER_ERROR"),
               });
            });
      }
   };

   useEffect(() => {
      if (debounceName === selectedEmail?.name) return;

      handleCheckTemplateName(form.getValues("name"));
   }, [debounceName]);

   useEffect(() => {
      if (form.getValues("value") !== "<p><br></p>") return;
      form.setValue("value", "");
   }, [form.watch("value")]);

   return (
      <StyledCreateAndEditEmail>
         <FormProvider {...form}>
            <Input
               label={t("Email name")}
               name="name"
               required
               placeholder={t("email.enterName")}
               message={message}
            />
            <EmailVariables
               editorRef={contentRef}
               name="value"
               label="Content"
               required
               data={selectedEmail && selectedEmail.value}
            />

            <GroupButton>
               <Button
                  loading={isLoading}
                  onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     form.handleSubmit(onSubmit)();
                  }}
               >
                  {t("common:confirm.save")}
               </Button>
               <Button onClick={handleClose} border="outline">
                  {t("common:confirm.cancel")}
               </Button>
            </GroupButton>
         </FormProvider>
      </StyledCreateAndEditEmail>
   );
};

export default CreateAndEditEmail;
