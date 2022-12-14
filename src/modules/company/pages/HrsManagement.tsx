import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";

import { useRole, ROLE_ENUM, useModal } from "../../../libs/common";
import {
   Button,
   Checkbox,
   DeleteIcon,
   EditIcon,
   Input,
   Modal,
   openNotification,
   SearchIcon,
   Switch,
   Table,
} from "../../../libs/components";
import { MdOutlinePassword } from "react-icons/md";

import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledModal } from "./styles";
import { useDeActivateMutation, useGetHrsQuery } from "../services";
import { useSearchParams } from "react-router-dom";
import { GroupButton } from "../components/modal/styles";
import { CreateAndEditHr } from "../components/modal";
import { IHr } from "../types";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { debounce } from "lodash";
import { Col, Row } from "antd";
import { useFilter } from "../hooks";

const HrsManagement = () => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();
   const [dataSource, setDataSource] = useState<any>([]);
   const [selectedId, setSelectedId] = useState<string | undefined>("");
   const [searchParams, setSearchParams] = useSearchParams();

   const [checked, setChecked] = useState<boolean>(!!searchParams.get("byCompany"));

   const { isOpen, handleOpen, handleClose } = useModal();
   const form = useForm({
      defaultValues: {
         keyword: searchParams.get("keyword"),
         byCompany: searchParams.get("byCompany"),
      },
      resolver: yupResolver(
         yup.object({
            keyword: yup.string(),
            byCompany: yup.boolean(),
         })
      ),
   });

   const {
      isOpen: isOpenDelete,
      handleClose: handleCloseDelete,
      handleOpen: handleOpenDeleteModal,
   } = useModal();

   const {
      data,
      isLoading: loadingHrs,
      isFetching: fetchingHrs,
   } = useGetHrsQuery(
      {
         ...tableInstance.params,
         ...useFilter(),
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const [deActivate, { isLoading: loadingDeactivate }] = useDeActivateMutation();

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
         title: t("Email"),
         dataIndex: "email",
         key: "email",
         sorter: true,
      },
      {
         title: t("adminManagement.role"),
         dataIndex: "role",
         key: "role",
         sorter: true,
      },
      {
         title: t("adminManagement.active"),
         dataIndex: "isActive",
         key: "isActive",
         sorter: true,
         render: (item) => <Switch checked={item} disabled={true} />,
      },

      {
         title: t("adminManagement.actions"),
         dataIndex: "id",
         render: (_: string, record: IHr) => (
            <StyledFunctions>
               <BtnFunction onClick={() => handleOpenUpdate(record.id)}>
                  <EditIcon />
               </BtnFunction>
               {record.isActive && (
                  <BtnFunction onClick={() => handleOpenDelete(record.id)}>
                     <DeleteIcon />
                  </BtnFunction>
               )}
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

   const setValueToSearchParams = (name: string, value: any) => {
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
      searchParams.get("id") &&
         deActivate(searchParams.get("id")!)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Deactivate this account successfully!!!"),
               });
               searchParams.delete("id");
               setSearchParams(searchParams);
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
      data &&
         setDataSource(
            data.users.map((item) => ({
               key: item.id,
               ...item,
            }))
         );
   }, [data]);

   return (
      <>
         <Header handleOpenCreate={handleOpen} title="Hiring Managers" />
         <ContainerTable>
            <FormProvider {...form}>
               <Row align={"middle"} gutter={[10, 10]}>
                  <Col span={12}>
                     <Input
                        icons={<SearchIcon />}
                        name="keyword"
                        onChange={(e) => {
                           form.setValue("keyword", e.target.value);
                           handleOnChange("keyword", e.target.value);
                        }}
                        placeholder={`${
                           checked ? "Search by company" : "Search by firstName, lastName"
                        }`}
                     />
                  </Col>
                  <Col>
                     <Checkbox
                        name="filterType"
                        checked={checked}
                        onChange={() => {
                           setChecked(!checked);
                           setValueToSearchParams("byCompany", !checked);

                           setSearchParams(searchParams);
                        }}
                     >
                        {t("By Company")}
                     </Checkbox>
                  </Col>
               </Row>
            </FormProvider>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingHrs || fetchingHrs}
               totalElements={data?.totalElements || 0}
               totalPages={data?.totalPages || 0}
            />
         </ContainerTable>
         <StyledModal
            title={searchParams.get("id") ? t("Update head hunter") : t("Create new head hunter")}
            destroyOnClose
            open={isOpen}
            onCancel={() => {
               handleClose();
               searchParams.delete("id");
               setSearchParams(searchParams);
            }}
         >
            <CreateAndEditHr handleClose={handleClose} />
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
                  loading={loadingDeactivate}
                  onClick={handleConfirmDelete}
               >
                  {t(t("common:confirm.ok"))}
               </Button>
            </GroupButton>
         </Modal>
      </>
   );
};

export default HrsManagement;
