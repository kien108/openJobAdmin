import {
   Button,
   DeleteIcon,
   EditIcon,
   Input,
   Modal,
   openNotification,
   PlusIcon,
   Title,
} from "../../../../libs/components";
import { useModal } from "../../../../libs/common";
import React, { useEffect, useState } from "react";
import { StyledContent, StyledHeader } from "./styles";
import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";
import { BtnFunction, StyledFunctions, StyledModal } from "../styles";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { GroupButton } from "../../components/modal/styles";
import { CreateAndEditSetting } from "../../components/modal";
import { useDeleteMutation, useGetSettingsQuery } from "../../services";

const DefaultSettings = () => {
   const { t } = useTranslation();
   const { isOpen, handleOpen, handleClose } = useModal();
   const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
   const [selectedName, setSelectedName] = useState<string | undefined>(undefined);

   const {
      isOpen: openEdit,
      handleOpen: handleOpenEdit,
      handleClose: handleCloseEdit,
   } = useModal();

   const form = useForm({
      defaultValues: {} as any,
      resolver: yupResolver(yup.object({})),
   });

   const {
      data: dataSettings,
      isLoading: loadingSettings,
      isFetching: fetchingSettings,
   } = useGetSettingsQuery({}, { refetchOnMountOrArgChange: true });

   const [deleteSetting, { isLoading: loadingDelete }] = useDeleteMutation();

   const handleConfirmDelete = () => {
      selectedId &&
         deleteSetting(selectedId)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Delete this setting successfully"),
               });

               handleClose();
               setSelectedId(undefined);
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("common:ERRORS.SERVER_ERROR"),
               });
            });
   };

   const handleEdit = () => {
      setSelectedId(undefined);
      setSelectedName(undefined);
      handleCloseEdit();
   };

   useEffect(() => {
      dataSettings &&
         dataSettings
            .filter((item) => !item.extraValue)
            .forEach((item) => {
               form.setValue(item.name, item.value);
            });
   }, [dataSettings]);
   return (
      <Spin spinning={loadingSettings || fetchingSettings}>
         <StyledHeader>
            <Title>{t("Default settings")}</Title>
            <Button
               height={44}
               icon={<PlusIcon />}
               onClick={() => {
                  handleOpenEdit();
               }}
            >
               {t("Create new setting")}
            </Button>
         </StyledHeader>
         <FormProvider {...form}>
            <Spin spinning={loadingSettings}>
               <StyledContent>
                  <Row gutter={[0, 20]} justify="space-between">
                     {dataSettings &&
                        dataSettings
                           .filter((item) => !item.extraValue)
                           .map((item) => (
                              <Col span={11} className="item">
                                 <Row gutter={[20, 20]} align="middle">
                                    <Col className="settings__name">
                                       <span>{item.name}</span>
                                    </Col>
                                    <Col flex={"auto"}>
                                       <Input disabled name={item.name} required />
                                    </Col>
                                    <Col>
                                       <StyledFunctions>
                                          <BtnFunction
                                             onClick={() => {
                                                setSelectedId(item.id);
                                                setSelectedName(item.name);
                                                handleOpenEdit();
                                             }}
                                          >
                                             <EditIcon />
                                          </BtnFunction>

                                          <BtnFunction
                                             onClick={() => {
                                                setSelectedId(item.id);
                                                handleOpen();
                                             }}
                                          >
                                             <DeleteIcon />
                                          </BtnFunction>
                                       </StyledFunctions>
                                    </Col>
                                 </Row>
                              </Col>
                           ))}
                  </Row>
               </StyledContent>
            </Spin>
         </FormProvider>
         <Modal
            type="confirm"
            visible={isOpen}
            onCancel={handleOpen}
            confirmIcon="?"
            title={t("Are you sure to delete this setting")}
         >
            <GroupButton>
               <Button
                  height={44}
                  key="back"
                  border="outline"
                  onClick={() => {
                     setSelectedId(undefined);
                     handleClose();
                  }}
               >
                  {t("common:confirm.cancel")}
               </Button>
               <Button
                  height={44}
                  key="submit"
                  loading={loadingDelete}
                  onClick={handleConfirmDelete}
               >
                  {t("common:confirm.ok")}
               </Button>
            </GroupButton>
         </Modal>
         <StyledModal destroyOnClose visible={openEdit} onCancel={handleEdit}>
            <CreateAndEditSetting
               handleClose={handleEdit}
               id={selectedId}
               settingName={selectedName}
            />
         </StyledModal>
      </Spin>
   );
};

export default DefaultSettings;
