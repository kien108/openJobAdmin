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
   Status,
   Switch,
   Table,
   Title,
} from "../../../libs/components";
import { MdOutlinePassword } from "react-icons/md";

import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledModal } from "./styles";
import { useDeActivateMutation, useGetUsersQuery } from "../services";
import { useSearchParams } from "react-router-dom";
import { GroupButton } from "../components/modal/styles";
import { CreateAndEditHr } from "../components/modal";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { Col, Row } from "antd";
import { useFilter } from "../hooks";
import { debounce } from "lodash";
import { ContactInformation } from "../components/ContactInformation";

const WebUserManagement = () => {
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

   const [searchParams, setSearchParams] = useSearchParams();
   const [checked, setChecked] = useState<boolean>(!!searchParams.get("byCompany"));

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
      data: data,
      isLoading: loadingUsers,
      isFetching: fetchingUsers,
   } = useGetUsersQuery(
      {
         ...tableInstance.params,
         ...useFilter(),
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

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
         render: (item) => (item ? item : "-"),
      },
      {
         title: t("adminManagement.role"),
         dataIndex: "role",
         key: "role",
         sorter: true,
         render: (item) => (item ? item : "-"),
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
         render: (_: string, record: any) => (
            <StyledFunctions>
               <BtnFunction onClick={() => handleOpenUpdate(record.id)}>
                  <EditIcon />
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

   useEffect(() => {
      data &&
         setDataSource(
            (data?.users ?? []).map((item) => ({
               key: item.id,
               ...item,
            }))
         );
   }, [data]);

   return (
      <>
         <Title>Web Users Management</Title>
         <ContainerTable>
            <FormProvider {...form}>
               <Row align={"middle"} gutter={[10, 10]}>
                  <Col span={24}>
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
               </Row>
            </FormProvider>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingUsers || fetchingUsers}
               totalElements={data?.totalElements || 0}
               totalPages={data?.totalPages || 0}
            />
         </ContainerTable>
         <StyledModal
            destroyOnClose
            open={isOpen}
            onCancel={() => {
               handleClose();
               searchParams.delete("id");
               setSearchParams(searchParams);
            }}
         >
            <ContactInformation handleClose={handleClose} />
         </StyledModal>
      </>
   );
};

export default WebUserManagement;
