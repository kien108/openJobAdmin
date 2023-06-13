import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";

import Parser from "html-react-parser";
import { useModal } from "../../../libs/common";
import {
   Button,
   DeleteIcon,
   EditIcon,
   EyeIcon,
   Input,
   Modal,
   openNotification,
   SearchIcon,
   Status,
   Table,
   TextEllipsis,
   Title,
} from "../../../libs/components";

import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import {
   BtnFunction,
   ContainerTable,
   StyledFunctions,
   StyledModal,
   StyledModalDetail,
} from "./styles";
import { useDeActivateMutation, useGetCompaniesQuery } from "../services";
import { useSearchParams } from "react-router-dom";
import { ICompany } from "../types";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { useFilter, useFilterCompany } from "../hooks";
import { debounce } from "lodash";
import { CreateAndEditHr, CreateCompany } from "../components";
import { GroupButton } from "../components/modal/styles";
import { MdOutlinePassword } from "react-icons/md";
import EditPassword from "../components/modal/EditPassword";
import CompanyDetail from "./../components/CompanyDetail/CompanyDetail";
import { FilterCompany } from "../components";
import moment from "moment";

const CompanyManagement = () => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();
   const [dataSource, setDataSource] = useState<any>([]);
   const [selectedId, setSelectedId] = useState<string | undefined>("");

   const { isOpen, handleOpen, handleClose } = useModal();
   const {
      isOpen: openEdit,
      handleOpen: handleOpenEdit,
      handleClose: handleCloseEdit,
   } = useModal();

   const [searchParams, setSearchParams] = useSearchParams();

   const {
      isOpen: isOpenDelete,
      handleClose: handleCloseDelete,
      handleOpen: handleOpenDeleteModal,
   } = useModal();

   const {
      isOpen: isOpenDetail,
      handleClose: handleCloseDetail,
      handleOpen: handleOpenDetailModal,
   } = useModal();

   const {
      isOpen: isOpenEditPassword,
      handleClose: handleCloseEditPassword,
      handleOpen: handleOpenEditPassword,
   } = useModal();

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
      data: dataCompanies,
      isLoading: loadingCompanies,
      isFetching: fetchingCompanies,
   } = useGetCompaniesQuery(
      {
         ...tableInstance.params,
         ...useFilterCompany(),
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const [deleteCompany, { isLoading: loadingDeleteCompany }] = useDeActivateMutation();

   const handleEditPassword = (id: string) => {
      setSelectedId(id);
      handleOpenEditPassword();
   };

   const columns: ColumnsType<any> = [
      {
         title: "Tên công ty",
         dataIndex: "name",
         key: "name",
         sorter: true,
         width: "12%",
      },
      {
         title: "Ngày tạo",
         dataIndex: "created_at",
         key: "createdAt",
         sorter: true,
         width: "10%",
      },
      {
         title: "Địa chỉ",
         dataIndex: "address",
         key: "address",
         sorter: true,
         render: (item) => (item ? <TextEllipsis data={item} length={50} /> : "-"),
      },
      {
         title: "Loại công ty",
         dataIndex: "company_type",
         key: "company_type",
      },
      {
         title: "Loại thành viên",
         dataIndex: "member_type",
         key: "member_type",
      },
      {
         title: "Trạng thái",
         dataIndex: "isActive",
         key: "isActive",
         render: (value) => <Status isActive={value} />,
      },

      {
         title: "Số điện thoại",
         dataIndex: "phone",
         key: "phone",
         render: (item) => (item ? item : "-"),
      },
      {
         title: "Email",
         dataIndex: "email",
         key: "email",
         render: (item) => (item ? item : "-"),
      },

      {
         title: "Hành động",
         dataIndex: "id",
         render: (_: string, record: ICompany) => (
            <StyledFunctions>
               <BtnFunction
                  onClick={() => {
                     searchParams.set("id", record?.id);
                     setSearchParams(searchParams);
                     handleOpenDetailModal();
                  }}
               >
                  <EyeIcon />
               </BtnFunction>
               <BtnFunction onClick={() => handleOpenUpdate(record.id)}>
                  <EditIcon />
               </BtnFunction>
               {/* <BtnFunction onClick={() => handleOpenDelete(record.id)}>
                  <DeleteIcon />
               </BtnFunction> */}
            </StyledFunctions>
         ),
      },
   ];

   const setValueToSearchParams = (name: string, value: string) => {
      if (value) {
         searchParams.set(name, value);
         setSearchParams(searchParams);
      } else {
         searchParams.delete(name);
         setSearchParams(searchParams);
      }
   };

   const handleOpenUpdate = (id: string) => {
      searchParams.set("id", id);
      setSearchParams(searchParams);
      handleOpenEdit();
   };

   const handleOpenDelete = (id: string) => {
      setSelectedId(id);
      handleOpenDeleteModal();
   };

   const handleOnChange = debounce(setValueToSearchParams, 500);

   const handleConfirmDelete = () => {
      selectedId &&
         deleteCompany(selectedId)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Deactivate company successfully!!!"),
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
      dataCompanies &&
         setDataSource(
            dataCompanies.companies.map((item) => ({
               key: item.id,
               ...item,
               member_type: item?.memberType,
               company_type: item?.companyType,
               created_at: item?.createdAt ? moment(item?.createdAt).format("DD/MM/YYYY") : "-",
            }))
         );
   }, [dataCompanies]);

   return (
      <>
         <Header handleOpenCreate={handleOpen} title="Quản lý công ty" />
         <ContainerTable>
            <FormProvider {...form}>
               <FilterCompany />
            </FormProvider>
            <Table
               size="middle"
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingCompanies || fetchingCompanies}
               totalElements={dataCompanies?.totalElements || 0}
               totalPages={dataCompanies?.totalPages || 0}
            />
         </ContainerTable>
         <StyledModal
            width={800}
            title={"Thêm mới công ty"}
            destroyOnClose
            open={isOpen}
            onCancel={handleClose}
         >
            <CreateCompany handleClose={handleClose} />
         </StyledModal>

         <StyledModal
            width={"75%"}
            title={"Cập nhật công ty"}
            destroyOnClose
            open={openEdit}
            onCancel={() => {
               handleCloseEdit();
               searchParams.delete("id");
               setSearchParams(searchParams);
            }}
         >
            <CreateAndEditHr
               handleClose={() => {
                  handleCloseEdit();
                  searchParams.delete("id");
                  setSearchParams(searchParams);
               }}
            />
         </StyledModal>

         <StyledModalDetail
            width={"75%"}
            title={"Xem chi tiết công ty"}
            destroyOnClose
            open={isOpenDetail}
            onCancel={() => {
               handleCloseDetail();
               searchParams.delete("id");
               setSearchParams(searchParams);
            }}
         >
            <CompanyDetail
               handleClose={() => {
                  handleCloseDetail();
                  searchParams.delete("id");
                  setSearchParams(searchParams);
               }}
            />
         </StyledModalDetail>

         <Modal
            type="confirm"
            open={isOpenDelete}
            onCancel={() => {
               searchParams.delete("id");
               setSearchParams(searchParams);
               handleCloseDelete();
            }}
            confirmIcon="?"
            title={t("Do to want to delete this company?")}
         >
            <GroupButton>
               <Button
                  height={44}
                  style={{ padding: "0 24px" }}
                  key="back"
                  border="outline"
                  onClick={() => {
                     setSelectedId(undefined);
                     handleCloseDelete();
                  }}
               >
                  {t("common:confirm.cancel")}
               </Button>
               <Button
                  height={44}
                  key="submit"
                  loading={loadingDeleteCompany}
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

export default CompanyManagement;
