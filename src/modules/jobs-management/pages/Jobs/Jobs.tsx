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
import { useGetCompanyJobsQuery, useGetJobsQuery, useReviewJobMutation } from "../../services";
import { useFilter } from "../../hooks";
import { FilterJobs } from "../../components/FilterJobs";
import { JobDetail } from "../../components/modal";
import { IJob } from "../../types/JobType";
import { convertPrice } from "../../../../utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover } from "../../components";
import { EJobStatus } from "../../../../types";

enum EConfirmType {
   OK = "OK",
   REJECT = "REJECT",
}

const Jobs = () => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();
   const [dataSource, setDataSource] = useState<any>([]);
   const [selectedId, setSelectedId] = useState<string | undefined>("");
   const [selectedRecord, setSelectedRecord] = useState<any>(undefined);
   const [confirmType, setConfirmType] = useState<EConfirmType>(EConfirmType.OK);

   const [searchParams, setSearchParams] = useSearchParams();

   const form = useForm({
      resolver: yupResolver(
         yup.object({
            rejectReasons:
               confirmType === EConfirmType.OK
                  ? yup.string()
                  : yup.string().required("Trường này không được để trống").nullable().trim(),
         })
      ),
   });

   const {
      data: dataJobs,
      isLoading: loadingJobs,
      isFetching: fetchingJobs,
   } = useGetJobsQuery(
      { ...tableInstance.params, ...useFilter(), sort: "createdAt,desc" },
      {
         refetchOnMountOrArgChange: true,
         skip: searchParams.get("company") as any,
      }
   );

   const [reviewJob, { isLoading: loadingReviewJob }] = useReviewJobMutation();

   const {
      isOpen: isOpenDetail,
      handleClose: handleCloseDetail,
      handleOpen: handleOpenDetailModal,
   } = useModal();

   const {
      isOpen: isOpenModalConfirm,
      handleClose: handleCloseConfirm,
      handleOpen: handleOpenConfirm,
   } = useModal();

   const {
      isOpen: isOpenValidate,
      handleClose: handleCloseValidate,
      handleOpen: handleOpenValidate,
   } = useModal();

   const columns: ColumnsType<any> = [
      {
         title: t("Tiêu đề"),
         dataIndex: "title",
         key: "title",
         width: "20%",
         render: (item) => <TextEllipsis className="name" data={item} length={50} />,
      },
      {
         title: t("Công ty"),
         dataIndex: "companyName",
         key: "title",
         width: "20%",
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
         render: (item) => <span>{moment(item).format("DD/MM/YYYY")}</span>,
      },
      {
         title: t("Ngày hết hạn"),
         dataIndex: "expiredAt",
         key: "expiredAt",
         render: (item) => <span>{item ? moment(item).format("DD/MM/YYYY") : "-"}</span>,
      },
      {
         title: t("Trạng thái"),
         dataIndex: "jobStatus",
         key: "jobStatus",
      },

      {
         title: "Chức năng",
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

               {record?.jobStatus === EJobStatus.NEW && (
                  <BtnFunction onClick={() => setSelectedId(record?.id)}>
                     <Popover
                        overlayClassName="styled-header-popover"
                        trigger="click"
                        visible={selectedId === record?.id}
                        onVisibleChange={(value) => {
                           return selectedId ? setSelectedId(undefined) : setSelectedId(record?.id);
                        }}
                        content={
                           <div className="dropdown-group-btn">
                              <span
                                 className="button-content"
                                 onClick={() => {
                                    setSelectedRecord(record);
                                    setConfirmType(EConfirmType.OK);
                                    handleOpenConfirm();
                                 }}
                              >
                                 Đồng ý
                              </span>
                              <span
                                 className="button-content"
                                 onClick={() => {
                                    setSelectedRecord(record);
                                    setConfirmType(EConfirmType.REJECT);
                                    handleOpenConfirm();
                                 }}
                              >
                                 Từ chối
                              </span>
                           </div>
                        }
                     >
                        <button className="button-header hover">
                           <BsThreeDotsVertical size={23} />
                        </button>
                     </Popover>
                  </BtnFunction>
               )}
            </StyledFunctions>
         ),
      },
   ];

   useEffect(() => {
      const dataSource = (dataJobs?.jobs ?? [])?.map((item: IJob) => ({
         key: item.id,
         ...item,
         salary: item?.salaryInfo?.isSalaryNegotiable
            ? "Thỏa thuận"
            : `${convertPrice(item?.salaryInfo?.minSalary)} - ${convertPrice(
                 item?.salaryInfo?.maxSalary
              )} (${item?.salaryInfo?.salaryType})`,

         companyName: item?.company?.name,
      }));

      setDataSource(dataSource || []);
   }, [dataJobs]);

   const handleValidate = (data: any) => {
      const payload = {
         isApprove: confirmType === EConfirmType.OK,
         jobs: [selectedRecord],
         ...(confirmType === EConfirmType.REJECT && {
            rejectReasons: [data?.rejectReasons],
         }),
      };

      reviewJob(payload)
         .unwrap()
         .then((res) => {
            openNotification({
               type: "success",
               message: "Kiểm duyệt hoàn tất",
            });

            handleCloseConfirm();
         })
         .catch((error) => {
            openNotification({
               type: "error",
               message: t("common:ERRORS.SERVER_ERROR"),
            });
         });
   };

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
            title="Tin tuyển dụng"
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

         <Modal
            title={`Bạn có chắc chắn muốn ${
               confirmType === EConfirmType.OK ? "đồng ý" : "từ chối"
            } tin tuyển dụng này không ?`}
            visible={isOpenModalConfirm}
            onCancel={() => {
               handleCloseConfirm();
               setSelectedRecord(undefined);
               form.reset({});
            }}
            type="confirm"
            confirmIcon="?"
            destroyOnClose
         >
            {confirmType === EConfirmType.REJECT && (
               <FormProvider {...form}>
                  <Input type="textarea" required label="Lý do từ chối" name="rejectReasons" />
               </FormProvider>
            )}
            <GroupButton style={{ marginTop: "30px" }}>
               <Button
                  loading={loadingReviewJob}
                  onClick={() => form.handleSubmit(handleValidate)()}
               >
                  Đồng ý
               </Button>
               <Button
                  border="outline"
                  onClick={() => {
                     handleCloseConfirm();
                     setSelectedRecord(undefined);
                     form.reset({});
                  }}
               >
                  Hủy bỏ
               </Button>
            </GroupButton>
         </Modal>
      </Container>
   );
};

export default Jobs;
