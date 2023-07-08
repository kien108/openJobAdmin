import React, { FC, ReactNode, useEffect, useRef, useState } from "react";

import {
   Button,
   Checkbox,
   DeleteIcon,
   Input,
   MinimizeIcon,
   Modal,
   openNotification,
   OptionType,
   PlusIcon,
   Select,
   Switch,
   Table,
} from "../../../../libs/components";

import {
   BtnFunction,
   GroupButton,
   StyledCreateAndEditHr,
   StyledExtendOption,
   StyledListUnits,
   StyledNotFound,
} from "./styles";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { FormProvider, useForm, useFieldArray } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Col, Divider, Row, Spin } from "antd";

import {
   RootState,
   useCommonSelector,
   useDebounce,
   useGetAdminByIdQuery,
   useModal,
} from "../../../../libs/common";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useGetJobByIdQuery, useReviewJobMutation } from "../../services";
import { ColumnsType } from "antd/es/table";
import Parser from "html-react-parser";
import { convertPrice } from "../../../../utils";
import { EJobStatus } from "../../../../types";

interface ICreateAndEditAdmin {
   handleClose: () => void;
}

enum EConfirmType {
   OK = "OK",
   REJECT = "REJECT",
}

type FormType = {
   title: string;
   skills: any;
   specialization: string;
   quantity: string;
   workPlace: string;
   salary: string;
   majorId: string;
   specializationId: string;
   hoursPerWeek: number;
};

const CreateJob: FC<ICreateAndEditAdmin> = ({ handleClose }) => {
   const { t } = useTranslation();
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();
   const tableInstance = Table.useTable();
   const { user } = useCommonSelector((state: RootState) => state.user);
   const [dataSources, setDataSources] = useState<any>([]);

   const [reviewJob, { isLoading: loadingReviewJob }] = useReviewJobMutation();

   const [selectedRecord, setSelectedRecord] = useState<any>(undefined);
   const [confirmType, setConfirmType] = useState<EConfirmType>(EConfirmType.OK);

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
      isOpen: isOpenModalConfirm,
      handleClose: handleCloseConfirm,
      handleOpen: handleOpenConfirm,
   } = useModal();

   const {
      data: dataJob,
      isLoading: loadingJob,
      isFetching: fetchingJob,
   } = useGetJobByIdQuery(searchParams.get("id")!, {
      skip: !searchParams.get("id"),
      refetchOnMountOrArgChange: true,
   });

   const columns: ColumnsType<any> = [
      {
         title: "Tên",
         dataIndex: "name",
         key: "name",
         width: "23%",
         render: (value) => (
            <span className="value primary" style={{ fontSize: "16px" }}>
               {value || "-"}
            </span>
         ),
      },
      {
         title: "Năm kinh nghiệm",
         dataIndex: "yoe",
         key: "yoe",
         width: "20%",
         render: (value) => <>{value}</>,
      },
      {
         title: "Độ ưu tiên / 100%",
         dataIndex: "weight",
         key: "weight",
         width: "30%",
         render: (value, record) => value,
      },
      {
         title: "Bắt buộc",
         dataIndex: "required",
         key: "required",
         width: "13%",
         render: (value, record) => (value ? "Có" : "Không"),
      },
   ];

   useEffect(() => {
      const data = (dataJob?.jobSkills ?? [])?.map((item) => ({
         key: item?.id,
         name: item?.skill?.name,
         required: item?.required,
         weight: item?.weight,
         yoe: item?.yoe,
      }));

      setDataSources(data);
   }, [dataJob]);

   const handleValidate = (data: any) => {
      const payload = {
         isApprove: confirmType === EConfirmType.OK,
         jobs: [dataJob],
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

            handleClose();
         })
         .catch((error) => {
            openNotification({
               type: "error",
               message: t("common:ERRORS.SERVER_ERROR"),
            });
         });
   };

   return (
      <Spin spinning={loadingJob || fetchingJob}>
         <StyledCreateAndEditHr>
            <Row gutter={[10, 30]}>
               <Col span={24}>
                  <div className="title-container" style={{ marginBottom: "20px" }}>
                     <span className="label">Công ty:</span>
                     <span className="value primary">{dataJob?.company?.name}</span>
                  </div>
                  <div className="title-container">
                     <span className="label">Tiêu đề:</span>
                     <span className="value primary">{dataJob?.title}</span>
                  </div>
               </Col>
               <Col span={24}>
                  <div className="listSkill">
                     <Row gutter={[10, 10]}>
                        <Col span={12}>
                           <div className="title-container">
                              <span className="label">Chuyên ngành:</span>
                              <span className="value">{dataJob?.major?.name}</span>
                           </div>
                        </Col>
                        <Col span={12}>
                           <div className="title-container">
                              <span className="label">Chuyên ngành hẹp:</span>
                              <span className="value">{dataJob?.specialization?.name}</span>
                           </div>
                        </Col>
                     </Row>

                     <span className="label" style={{ display: "block", marginTop: "20px" }}>
                        Kỹ năng
                     </span>
                     <Col span={24}>
                        <Table
                           dataSource={dataSources}
                           tableInstance={tableInstance}
                           columns={columns}
                           totalPages={0}
                           totalElements={0}
                           showPagination={false}
                           loading={false}
                        />
                     </Col>
                  </div>
               </Col>

               <Col span={12}>
                  <div className="title-container">
                     <span className="label">Vị trí:</span>
                     <span className="value primary">{dataJob?.jobLevel}</span>
                  </div>
               </Col>
               <Col span={12}>
                  <div className="title-container">
                     <span className="label">Loại công việc:</span>
                     <span className="value">{dataJob?.jobType}</span>
                  </div>
               </Col>
               <Col span={12}>
                  <div className="title-container">
                     <span className="label">Số lượng:</span>
                     <span className="value">{dataJob?.quantity}</span>
                  </div>
               </Col>
               <Col span={12}>
                  <div className="title-container">
                     <span className="label">Nơi làm việc:</span>
                     <span className="value">{dataJob?.workPlace}</span>
                  </div>
               </Col>
               <Col span={12}>
                  <div className="title-container">
                     <span className="label">Lương:</span>
                     <span className="value primary">
                        {dataJob?.salaryInfo?.isSalaryNegotiable
                           ? "Thỏa thuận"
                           : `${convertPrice(dataJob?.salaryInfo?.minSalary)} - ${convertPrice(
                                dataJob?.salaryInfo?.maxSalary
                             )} (${dataJob?.salaryInfo?.salaryType})`}
                     </span>
                  </div>
               </Col>
               <Col span={12}>
                  <div className="title-container">
                     <span className="label">Thời gian làm việc / tuần:</span>
                     <span className="value"> {dataJob?.hoursPerWeek}</span>
                  </div>
               </Col>
               <Col span={24}>
                  <span className="label">Mô tả công việc</span>
                  <p className="value">
                     {dataJob?.description ? Parser(`${dataJob?.description}`) : "-"}
                  </p>
               </Col>
            </Row>

            {/* <span
               className="go-to-cvs"
               onClick={() => {
                  navigate(`${searchParams.get("id")}/cv-matched`);
               }}
            >
               View list CV
            </span> */}

            <GroupButton>
               {dataJob?.jobStatus === EJobStatus.NEW ? (
                  <>
                     <Button
                        onClick={() => {
                           setConfirmType(EConfirmType.OK);
                           handleOpenConfirm();
                        }}
                     >
                        Đồng ý
                     </Button>

                     <Button
                        border="outline"
                        onClick={() => {
                           setConfirmType(EConfirmType.REJECT);
                           handleOpenConfirm();
                        }}
                     >
                        Từ chối
                     </Button>
                  </>
               ) : (
                  <Button
                     onClick={() => {
                        handleClose();
                        searchParams.delete("id");
                        setSearchParams(searchParams);
                     }}
                  >
                     Đóng
                  </Button>
               )}
            </GroupButton>

            <Modal
               title={`Bạn có chắc chắn muốn ${
                  confirmType === EConfirmType.OK ? "đồng ý" : "từ chối"
               } đơn đăng ký này không ?`}
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
         </StyledCreateAndEditHr>
      </Spin>
   );
};

export default CreateJob;
