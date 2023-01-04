import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";

import { useRole, ROLE_ENUM, useModal } from "../../../libs/common";
import {
   Button,
   DeleteIcon,
   EditIcon,
   Modal,
   openNotification,
   Status,
   Switch,
   Table,
} from "../../../libs/components";
import { MdOutlinePassword } from "react-icons/md";

import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledModal } from "./styles";
import { useDeleteAdminMutation, useGetAdminsQuery, useGetCompaniesQuery } from "../services";
import { CreateAndEditAdmin, EditPassword } from "../components/modal";
import { useSearchParams } from "react-router-dom";
import { GroupButton } from "../components/modal/styles";
import { IAdminDetail } from "../types";

const AdminManagement = () => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();
   const [dataSource, setDataSource] = useState<any>([]);
   const [selectedId, setSelectedId] = useState<string | undefined>("");

   const { isOpen, handleOpen, handleClose } = useModal();
   const {
      isOpen: isOpenDelete,
      handleClose: handleCloseDelete,
      handleOpen: handleOpenDeleteModal,
   } = useModal();
   const {
      isOpen: isOpenEditPassword,
      handleClose: handleCloseEditPassword,
      handleOpen: handleOpenEditPassword,
   } = useModal();

   const [searchParams, setSearchParams] = useSearchParams();

   const {
      data,
      isLoading: loadingAdmins,
      isFetching: fetchingAdmins,
   } = useGetAdminsQuery(
      {
         ...tableInstance.params,
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const [deleteAdmin, { isLoading: loadingDelete }] = useDeleteAdminMutation();

   const columns: ColumnsType<any> = [
      {
         title: t("adminManagement.firstName"),
         dataIndex: "firstName",
         key: "firstName",
         sorter: true,
         render: (item) => (item ? item : "-"),
      },
      {
         title: t("adminManagement.lastName"),
         dataIndex: "lastName",
         key: "lastName",
         sorter: true,
         render: (item) => (item ? item : "-"),
      },
      {
         title: t("adminManagement.role"),
         dataIndex: "role",
         key: "role",
         sorter: true,
      },
      {
         title: t("adminManagement.username"),
         dataIndex: "username",
         key: "username",
         sorter: true,
      },
      {
         title: t("adminManagement.active"),
         dataIndex: "isActive",
         key: "isActive",
         sorter: true,
         render: (item) => <Status isActive={item} />,
      },

      {
         title: t("adminManagement.actions"),
         dataIndex: "id",
         render: (_: string, record: IAdminDetail) => (
            <StyledFunctions>
               <BtnFunction onClick={() => handleOpenUpdate(record.id)}>
                  <EditIcon />
               </BtnFunction>
               <BtnFunction onClick={() => handleOpenDelete(record.id)}>
                  <DeleteIcon />
               </BtnFunction>

               <BtnFunction onClick={() => handleEditPassword(record.id)}>
                  <MdOutlinePassword size={25} className="icon-password" />
               </BtnFunction>
            </StyledFunctions>
         ),
      },
   ];

   const handleOpenUpdate = (id: string) => {
      searchParams.set("id", id);
      setSearchParams(searchParams);
      handleOpen();
   };

   const handleOpenDelete = (id: string) => {
      searchParams.set("id", id);
      setSearchParams(searchParams);
      handleOpenDeleteModal();
   };

   const handleEditPassword = (id: string) => {
      setSelectedId(id);
      handleOpenEditPassword();
   };

   const handleConfirmDelete = () => {
      searchParams.get("id") &&
         deleteAdmin(searchParams.get("id")!)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("adminManagement.deleteAdminSuccessful"),
               });
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("common:ERRORS.SERVER_ERROR"),
               });
            })
            .finally(() => {
               searchParams.delete("id");
               setSearchParams(searchParams);
               handleCloseDelete();
            });
   };

   useEffect(() => {
      data &&
         setDataSource(
            data.admins.map((item) => ({
               key: item.id,
               ...item,
            }))
         );
   }, [data]);

   return (
      <>
         <Header isCreate={useRole([ROLE_ENUM.SUPER_ADMIN])} handleOpenCreate={handleOpen} />
         <ContainerTable>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingAdmins || fetchingAdmins}
               totalElements={data?.totalElements || 0}
               totalPages={data?.totalPages || 0}
            />
         </ContainerTable>
         <StyledModal
            title={searchParams.get("id") ? t("adminManagement.edit") : t("adminManagement.create")}
            destroyOnClose
            open={isOpen}
            onCancel={() => {
               handleClose();
               searchParams.delete("id");
               setSearchParams(searchParams);
            }}
         >
            <CreateAndEditAdmin handleClose={handleClose} />
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
            title={t("adminManagement.deleteWarning")}
         >
            <GroupButton>
               <Button
                  height={44}
                  style={{ padding: "0 24px" }}
                  key="back"
                  border="outline"
                  onClick={() => {
                     searchParams.delete("id");
                     setSearchParams(searchParams);
                     handleCloseDelete();
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
                  {t(t("common:confirm.ok"))}
               </Button>
            </GroupButton>
         </Modal>
         <StyledModal
            title={t("adminManagement.editPassword")}
            destroyOnClose={true}
            open={isOpenEditPassword}
            onCancel={() => {
               handleCloseEditPassword();
               setSelectedId(undefined);
            }}
         >
            <EditPassword
               handleClose={() => {
                  handleCloseEditPassword();
                  setSelectedId(undefined);
               }}
               id={selectedId}
            />
         </StyledModal>
      </>
   );
};

export default AdminManagement;
