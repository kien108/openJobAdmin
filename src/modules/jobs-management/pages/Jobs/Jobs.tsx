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
   Status,
   Table,
   TextEllipsis,
   Title,
} from "../../../../libs/components";

import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { BtnFunction, Container, ContainerTable, StyledFunctions, StyledModal } from "./styles";
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
import { IJob } from "../../types/JobType";
import { convertPrice } from "../../../../utils";

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
         title: t("Tiêu đề"),
         dataIndex: "title",
         key: "title",
         sorter: true,
         width: "20%",
         render: (item) => <TextEllipsis className="name" data={item} length={50} />,
      },
      {
         title: t("Vị trí"),
         dataIndex: "jobLevel",
         key: "jobLevel",
         width: "8%",
      },
      {
         title: t("Số lượng"),
         dataIndex: "quantity",
         key: "quantity",
      },

      {
         title: t("Lương"),
         dataIndex: "salary",
         key: "salary",
         render: (item) => <span className="salary">{item}</span>,
      },

      {
         title: t("Ngày đăng"),
         dataIndex: "createdAt",
         key: "createdAt",
         sorter: true,

         render: (item) => <span>{moment(item).format("DD/MM/YYYY")}</span>,
      },
      {
         title: t("Ngày hết hạn"),
         dataIndex: "expiredAt",
         key: "expiredAt",
         sorter: true,

         render: (item) => <span>{item ? moment(item).format("DD/MM/YYYY") : "-"}</span>,
      },
      {
         title: t("Trạng thái"),
         dataIndex: "jobStatus",
         key: "jobStatus",
      },

      {
         title: t("Action"),
         dataIndex: "id",

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

   useEffect(() => {
      const dataSource = (dataJobs?.jobs ?? [])
         .filter((item: any) => !item?.expiredAt || moment(item?.expiredAt).isAfter(moment()))
         ?.map((item: IJob) => ({
            key: item.id,
            ...item,
            salary: !item?.salaryInfo?.negotiable
               ? "Thỏa thuận"
               : `${convertPrice(item?.salaryInfo?.min)} - ${convertPrice(
                    item?.salaryInfo?.max
                 )} (${item?.salaryInfo?.salaryType})`,
         }));

      setDataSource(dataSource || []);
   }, [dataJobs]);

   return (
      <Container>
         <Title>Quản lý tin tuyển dụng</Title>
         <ContainerTable>
            <FilterJobs />

            <Table
               size="small"
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingJobs || fetchingJobs}
               totalElements={dataJobs?.totalElements || 0}
               totalPages={dataJobs?.totalPages || 0}
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
      </Container>
   );
};

export default Jobs;
