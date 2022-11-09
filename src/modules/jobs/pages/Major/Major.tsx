import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledModal } from "../styles";
import {
   Button,
   DeleteIcon,
   EditIcon,
   Input,
   Modal,
   openNotification,
   SearchIcon,
   Switch,
   Table,
} from "../../../../libs/components";

import { useModal } from "../../../../libs/common";
import { Header } from "../../components/Header";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import CreateAndEditMajor from "../../components/modal/CreateAndEditMajor";
import { GroupButton } from "../../components/modal/styles";
import { useDeleteMajorMutation, useGetMajorsQuery } from "../../services";
import useFilter from "../../hooks/useFilter";

const Major = () => {
   const { t } = useTranslation();
   const [selectedMajor, setSelectedMajor] = useState<any>(undefined);
   const [searchParams, setSearchParams] = useSearchParams();
   const [dataSource, setDataSource] = useState<any>([]);

   const tableInstance = Table.useTable();

   const { isOpen, handleOpen, handleClose } = useModal();

   const form = useForm({
      defaultValues: {
         keyword: searchParams.get("keyword"),
      },
      resolver: yupResolver(
         yup.object({
            keyword: yup.string(),
         })
      ),
   });

   const {
      isOpen: isOpenDelete,
      handleClose: handleCloseDelete,
      handleOpen: handleOpenDeleteModal,
   } = useModal();

   const {
      data: dataMajors,
      isLoading: loadingMajors,
      isFetching: fetchingMajors,
   } = useGetMajorsQuery(
      {
         ...tableInstance.params,
         ...useFilter(),
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const [deleteMajor, { isLoading: loadingDeleteMajor }] = useDeleteMajorMutation();

   const columns: ColumnsType<any> = [
      {
         title: t("Name"),
         dataIndex: "name",
         key: "name",
         sorter: true,
      },
      {
         title: t("adminManagement.actions"),
         dataIndex: "id",
         render: (_: string, item: any) => (
            <StyledFunctions>
               <BtnFunction onClick={() => handleOpenUpdate(item)}>
                  <EditIcon />
               </BtnFunction>
               <BtnFunction onClick={() => handleOpenDelete(item)}>
                  <DeleteIcon />
               </BtnFunction>
            </StyledFunctions>
         ),
      },
   ];

   const handleOpenUpdate = (major: any) => {
      setSelectedMajor(major);
      handleOpen();
   };

   const handleOpenDelete = (major: any) => {
      setSelectedMajor(major);

      handleOpenDeleteModal();
   };
   const setValueToSearchParams = (name: string, value: string) => {
      if (value) {
         searchParams.set(name, value);
         setSearchParams(searchParams);
      } else {
         searchParams.delete(name);
         setSearchParams(searchParams);
      }
   };
   const handleOnChange = debounce(setValueToSearchParams, 500);

   const handleConfirmDelete = () => {
      selectedMajor &&
         deleteMajor(selectedMajor.id)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Delete this major successfully!!!"),
               });
               setSelectedMajor(undefined);
               handleCloseDelete();
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("common:ERRORS.SERVER_ERROR"),
               });
            });
   };

   useEffect(() => {
      if (!dataMajors) return;

      dataMajors &&
         setDataSource(
            dataMajors.map((item: any) => ({
               key: item.id,
               ...item,
            }))
         );
   }, [dataMajors]);
   return (
      <>
         <Header handleOpenCreate={handleOpen} title="Major Management" />
         <ContainerTable>
            <FormProvider {...form}>
               <Input
                  icons={<SearchIcon />}
                  name="keyword"
                  onChange={(e) => {
                     form.setValue("keyword", e.target.value);
                     handleOnChange("keyword", e.target.value);
                  }}
                  placeholder="Search by major name"
               />
            </FormProvider>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingMajors || fetchingMajors}
               totalElements={0}
               totalPages={0}
            />
         </ContainerTable>
         <StyledModal
            title={selectedMajor ? t("Update major") : t("Create new major")}
            destroyOnClose
            open={isOpen}
            onCancel={() => {
               handleClose();
               setSelectedMajor(undefined);
            }}
         >
            <CreateAndEditMajor
               major={selectedMajor}
               handleClose={() => {
                  handleClose();
                  setSelectedMajor(undefined);
               }}
            />
         </StyledModal>
         <Modal
            type="confirm"
            open={isOpenDelete}
            onCancel={() => {
               searchParams.delete("id");
               setSearchParams(searchParams);
               handleCloseDelete();
            }}
            confirmIcon="?"
            title={t("Do to want to delete this major?")}
         >
            <GroupButton>
               <Button
                  height={44}
                  style={{ padding: "0 24px" }}
                  key="back"
                  border="outline"
                  onClick={() => {
                     setSelectedMajor(undefined);
                     handleCloseDelete();
                  }}
               >
                  {t("common:confirm.cancel")}
               </Button>
               <Button
                  height={44}
                  key="submit"
                  loading={loadingDeleteMajor}
                  onClick={handleConfirmDelete}
               >
                  {t(t("common:confirm.ok"))}
               </Button>
            </GroupButton>
         </Modal>
      </>
   );
};

export default Major;
