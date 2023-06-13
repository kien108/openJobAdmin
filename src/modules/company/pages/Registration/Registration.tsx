import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";

import Parser from "html-react-parser";
import { useModal } from "../../../../libs/common";
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
} from "../../../../libs/components";

import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import {
   BtnFunction,
   ContainerTable,
   StyledFunctions,
   StyledModal,
   StyledModalDetail,
} from "../styles";
import {
   useDeActivateMutation,
   useGetCompaniesQuery,
   useGetUnapprovedCompaniesQuery,
} from "../../services";
import { useSearchParams } from "react-router-dom";
import { ICompany, IUnapproved } from "../../types";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { useFilter, useFilterCompany } from "../../hooks";
import { debounce } from "lodash";
import {
   CreateAndEditHr,
   CreateCompany,
   FilterRegistration,
   RegistrationDetail,
} from "../../components";
import { GroupButton } from "../../components/modal/styles";
import moment from "moment";

const CompanyManagement = () => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();
   const [dataSource, setDataSource] = useState<IUnapproved[]>([]);
   const [selectedId, setSelectedId] = useState<string | undefined>("");
   const [selectedRecord, setSelectedRecord] = useState<IUnapproved | undefined>(undefined);

   const [searchParams, setSearchParams] = useSearchParams();

   const {
      isOpen: isOpenDetail,
      handleClose: handleCloseDetail,
      handleOpen: handleOpenDetailModal,
   } = useModal();

   const {
      isOpen: isOpenDelete,
      handleClose: handleCloseDelete,
      handleOpen: handleOpenDelete,
   } = useModal();

   const {
      data: dataCompanies,
      isLoading: loadingCompanies,
      isFetching: fetchingCompanies,
   } = useGetUnapprovedCompaniesQuery(
      {
         ...tableInstance.params,
         ...useFilterCompany(),
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const columns: ColumnsType<any> = [
      {
         title: "Tên công ty",
         dataIndex: "companyName",
         key: "companyName",
         sorter: true,
         width: "12%",
         render: (item) => (item ? <TextEllipsis data={item} length={50} /> : "-"),
      },
      {
         title: "Ngày tạo",
         dataIndex: "created_at",
         key: "createdAt",
         sorter: true,
         width: "10%",
         render: (_, record: IUnapproved) =>
            record?.createdAt ? moment(record?.createdAt).format("DD/MM/YYYY") : "-",
      },
      {
         title: "Người đại diện",
         dataIndex: "headHunterName",
         key: "headHunterName",
         // sorter: true,
         render: (item) => (item ? <TextEllipsis data={item} length={50} /> : "-"),
      },
      {
         title: "Số điện thoại",
         dataIndex: "phone",
         key: "phone",
      },
      {
         title: "Email",
         dataIndex: "position",
         key: "position",
      },
      {
         title: "Vị trí",
         dataIndex: "position",
         key: "position",
      },

      {
         title: "Hành động",
         dataIndex: "id",
         render: (_: string, record: IUnapproved) => (
            <StyledFunctions>
               <BtnFunction
                  onClick={() => {
                     setSelectedId(record?.id);
                     setSelectedRecord(record);
                     handleOpenDetailModal();
                  }}
               >
                  <EyeIcon />
               </BtnFunction>
               <BtnFunction
                  onClick={() => {
                     setSelectedId(record?.id);
                     handleOpenDelete();
                  }}
               >
                  <DeleteIcon />
               </BtnFunction>
            </StyledFunctions>
         ),
      },
   ];

   useEffect(() => {
      const dataSource = (dataCompanies?.content ?? [])?.map((item) => ({
         key: item?.id,
         ...item,
      }));

      const temp = [
         ...dataSource,
         {
            key: 1,
            companyName: "asdf",
            createdAt: "2023-06-12T14:03:14.622Z",
            email: "abc@gmail.com",
            headHunterName: "Nguyen Van A",
            id: "123123123",
            phone: "0923423423",
            position: "CEO",
         },
      ];
      setDataSource(temp);
   }, []);

   return (
      <>
         <Header title="Quản lý công ty" />
         <ContainerTable>
            <FilterRegistration />
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

         <StyledModalDetail
            width={650}
            title={"Xem chi tiết công ty"}
            destroyOnClose
            open={isOpenDetail}
            onCancel={() => {
               handleCloseDetail();
               searchParams.delete("id");
               setSearchParams(searchParams);
            }}
         >
            <RegistrationDetail
               data={selectedRecord}
               handleClose={() => {
                  setSelectedId(undefined);
                  handleCloseDetail();
               }}
            />
         </StyledModalDetail>

         <Modal
            type="confirm"
            open={isOpenDelete}
            onCancel={() => {
               setSelectedId(undefined);
               handleCloseDelete();
            }}
            confirmIcon="?"
            title="Bạn có chắc chắn muốn xóa yêu cầu đăng ký công ty này không ?"
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
                  Hủy bỏ
               </Button>
               <Button
                  height={44}
                  key="submit"
                  // loading={loadingDeleteCompany}
                  // onClick={handleConfirmDelete}
               >
                  Đồng ý
               </Button>
            </GroupButton>
         </Modal>
      </>
   );
};

export default CompanyManagement;
