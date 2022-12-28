import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";

import moment from "moment";
import { RootState, useCommonSelector, useModal } from "../../../../libs/common";
import {
   Button,
   DeleteIcon,
   EditIcon,
   EyeIcon,
   EyePwIcon,
   Input,
   Modal,
   openNotification,
   SearchIcon,
   Table,
   TextEllipsis,
   Title,
} from "../../../../libs/components";

import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledModal } from "./styles";
// import { useDeActivateMutation, useGetCompaniesQuery } from "../services";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { ICompany } from "../types";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { debounce } from "lodash";
import { GroupButton } from "../../components/modal/styles";
import { MdOutlinePassword } from "react-icons/md";
import { useGetCompanyJobsQuery, useGetJobsQuery } from "../../services";
import { useFilter } from "../../hooks";
import { FilterJobs } from "../../components/FilterJobs";
import { JobDetail } from "../../components/modal";

// import { useDeleteJobMutation, useGetJobCompanyQuery } from "../../services/JobAPI";

type FormType = {
   listSkill: any;
   objective: string;
   education: string;
   experience: string;
   certificate: string;
   majorId: string;
   specializationId: string;
   title: string;
};

const Jobs = () => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();
   const [dataSource, setDataSource] = useState<any>([]);
   const [selectedId, setSelectedId] = useState<string | undefined>("");

   const navigate = useNavigate();

   const { user } = useCommonSelector((state: RootState) => state.user);
   const { isOpen, handleOpen, handleClose } = useModal();

   const [searchParams, setSearchParams] = useSearchParams();

   const {
      data: dataCompaniesJobs,
      isLoading: loadingCompanyJobs,
      isFetching: fetchingCompanyJobs,
   } = useGetCompanyJobsQuery(
      { ...tableInstance.params, ...useFilter() },
      {
         refetchOnMountOrArgChange: true,
         skip: !searchParams.get("company"),
      }
   );

   const {
      data: dataJobs,
      isLoading: loadingJobs,
      isFetching: fetchingJobs,
   } = useGetJobsQuery(
      { ...tableInstance.params, ...useFilter() },
      {
         refetchOnMountOrArgChange: true,
         skip: searchParams.get("company") as any,
      }
   );

   const {
      isOpen: isOpenDetail,
      handleClose: handleCloseDetail,
      handleOpen: handleOpenDetailModal,
   } = useModal();

   const {
      isOpen: isOpenDelete,
      handleClose: handleCloseDelete,
      handleOpen: handleOpenDeleteModal,
   } = useModal();

   const columns: ColumnsType<any> = [
      {
         title: t("Company"),
         dataIndex: "companyName",
         key: "companyName",
         sorter: true,
         width: "15%",
      },
      {
         title: t("Title"),
         dataIndex: "title",
         key: "title",
         sorter: true,
         render: (item) => <TextEllipsis data={item} length={100} />,
         width: "25%",
      },
      {
         title: t("WorkPlace"),
         dataIndex: "workPlace",
         key: "workPlace",
         sorter: true,
         width: "15%",
         render: (item) => <span>{item.replaceAll("_", " ")}</span>,
      },
      {
         title: t("Salary"),
         dataIndex: "salary",
         key: "salary",
         sorter: true,
         width: "10%",
      },
      {
         title: t("Quantity"),
         dataIndex: "quantity",
         key: "quantity",
         sorter: true,
         width: "10%",
      },
      {
         title: t("Created At"),
         dataIndex: "createdAt",
         key: "createdAt",
         sorter: true,
         width: "10%",

         render: (item) => <span>{moment(item).format("MM/DD/YYYY")}</span>,
      },
      {
         title: t("Expired At"),
         dataIndex: "expiredAt",
         key: "expiredAt",
         sorter: true,
         width: "10%",

         render: (item) => <span>{item ? moment(item).format("MM/DD/YYYY") : "-"}</span>,
      },

      {
         title: t("Action"),
         dataIndex: "id",
         width: "10%",

         render: (_: string, record: any) => (
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
      handleOpen();
   };

   const handleOpenDelete = (id: string) => {
      setSelectedId(id);
      handleOpenDeleteModal();
   };

   const handleOnChange = debounce(setValueToSearchParams, 500);

   useEffect(() => {
      const data = searchParams.get("company") ? dataCompaniesJobs : dataJobs;

      const dataSource = (data?.jobs ?? [])
         .filter((item: any) => !item?.expiredAt || moment(item?.expiredAt).isAfter(moment()))
         ?.map((item: any) => ({
            key: item.id,
            companyName: item?.company?.name,
            ...item,
         }));

      setDataSource(dataSource || []);
   }, [dataJobs, dataCompaniesJobs, searchParams.get("company")]);

   return (
      <>
         <Title>Jobs Management</Title>
         <ContainerTable>
            <FilterJobs />

            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingJobs || fetchingJobs || loadingCompanyJobs || fetchingCompanyJobs}
               totalElements={
                  searchParams.get("company")
                     ? dataCompaniesJobs?.totalElements
                     : dataJobs?.totalElements
               }
               totalPages={
                  searchParams.get("company")
                     ? dataCompaniesJobs?.totalElements
                     : dataJobs?.totalPages
               }
            />
         </ContainerTable>
         <Modal
            title="Job Detail"
            visible={isOpenDetail}
            onCancel={() => {
               handleCloseDetail();
               searchParams.delete("id");
               setSearchParams(searchParams);
            }}
         >
            <JobDetail
               handleClose={() => {
                  handleCloseDetail();
                  searchParams.delete("id");
                  setSearchParams(searchParams);
               }}
            />
         </Modal>
      </>
   );
};

export default Jobs;
