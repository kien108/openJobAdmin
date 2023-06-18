import React, { FC } from "react";

import { Button, openNotification } from "../../../../libs/components";

import { Container, GroupButton } from "./styles";

import { useTranslation } from "react-i18next";
import { Col, Row, Spin } from "antd";

import { InputDetail } from "../InputDetail";
import { IUnapproved } from "../../types";
import { useReviewRegistrationMutation } from "../../services";

interface ICreateAndEditAdmin {
   handleClose: () => void;
   data?: IUnapproved | undefined;
}

const CreateAndEditHr: FC<ICreateAndEditAdmin> = ({ handleClose, data }) => {
   const { t } = useTranslation();

   const [review, { isLoading: loadingReview }] = useReviewRegistrationMutation();

   const handleBulkRegistration = (status: boolean) => {
      const payload = {
         approved: status,
         companyRegistrationList: [data],
      };
      review(payload)
         .unwrap()
         .then(() => {
            openNotification({
               type: "success",
               message: t("Thao tác thành công !!!"),
            });
            handleClose && handleClose();
         })
         .catch((error) => {
            openNotification({
               type: "error",
               message: t("INTERNAL SERVER ERROR"),
            });
         });
   };

   return (
      <Spin spinning={loadingReview}>
         <Container>
            <Row gutter={[20, 20]}>
               <Col span={24}>
                  <InputDetail label="Tên công ty" value={data?.companyName} />
               </Col>
               <Col span={24}>
                  <InputDetail label="Họ và tên người đại diện" value={data?.headHunterName} />
               </Col>
               <Col span={24}>
                  <InputDetail label="Chức vụ" value={data?.position} />
               </Col>
               <Col span={24}>
                  <InputDetail label="Số điện thoại" value={data?.phone} />
               </Col>
               <Col span={24}>
                  <InputDetail label="Email" value={data?.email} />
               </Col>
            </Row>

            <GroupButton>
               <Button onClick={(e) => handleBulkRegistration(true)}>Chấp nhận</Button>
               <Button onClick={() => handleBulkRegistration(false)} border="outline">
                  Từ chối
               </Button>
            </GroupButton>
         </Container>
      </Spin>
   );
};

export default CreateAndEditHr;
