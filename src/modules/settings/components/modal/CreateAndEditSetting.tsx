import { Button, Input, openNotification, Title } from "../../../../libs/components";
import { Col, Row, Spin } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { GroupButton } from "./styles";
import { useSearchParams } from "react-router-dom";
import { useCreateAndUpdateMutation, useGetByNameQuery } from "../../services";

interface IProps {
   handleClose: () => void;
   id?: string | undefined;
   settingName?: string | undefined;
}

const CreateAndEditSetting: FC<IProps> = ({ handleClose, id, settingName }) => {
   const { t } = useTranslation();

   const [searchParams, setSearchParams] = useSearchParams();

   const form = useForm({
      defaultValues: {
         name: "",
         value: "",
      },
      resolver: yupResolver(
         yup.object({
            name: yup
               .string()
               .trim()
               .required(t("common:form.required"))
               .min(4, "This field length must more than 3 characters"),
            value: yup.string().trim().required(t("common:form.required")),
         })
      ),
   });

   const [createAndUpdate, { isLoading }] = useCreateAndUpdateMutation();
   const { data: dataSetting, isLoading: loadingDataSetting } = useGetByNameQuery(settingName, {
      skip: !settingName,
      refetchOnMountOrArgChange: true,
   });

   const onSubmit = (data: any) => {
      console.log(id);
      id
         ? createAndUpdate({ ...data, type: "update", id })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Update this setting successfully"),
                 });

                 handleClose();
              })
              .catch((error) => {
                 openNotification({
                    type: "error",
                    message: t("common:ERRORS.SERVER_ERROR"),
                 });
              })
         : createAndUpdate({ ...data, type: "create" })
              .unwrap()
              .then(() => {
                 openNotification({
                    type: "success",
                    message: t("Create new setting successfully"),
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

   useEffect(() => {
      if (!dataSetting) return;

      form.setValue("name", dataSetting.name);
      form.setValue("value", dataSetting.value);
   }, [dataSetting]);

   return (
      <FormProvider {...form}>
         <Spin spinning={loadingDataSetting}>
            <Row gutter={[20, 20]} justify="center">
               <Col span={24}>
                  <Title>{id ? t("Edit Setting") : t("Create Setting")}</Title>
               </Col>
               <Col span={24}>
                  <Input
                     label={t("Setting Name")}
                     name="name"
                     required
                     placeholder={t("Enter setting name...")}
                  />
               </Col>
               <Col span={24}>
                  <Input
                     label={t("Value")}
                     name="value"
                     required
                     placeholder={t("Enter value...")}
                  />
               </Col>
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
            </Row>
         </Spin>
      </FormProvider>
   );
};

export default CreateAndEditSetting;
