import React, { FC } from "react";

import { Button } from "../../../../libs/components";

import { Container, GroupButton } from "./styles";

import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";

import { InputDetail } from "../InputDetail";
import { IUnapproved } from "../../types";

interface ICreateAndEditAdmin {
   handleClose: () => void;
   data?: IUnapproved | undefined;
}

const CreateAndEditHr: FC<ICreateAndEditAdmin> = ({ handleClose, data }) => {
   const { t } = useTranslation();

   return (
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
            <Button onClick={(e) => {}}>Chấp nhận</Button>
            <Button onClick={handleClose} border="outline">
               Từ chối
            </Button>
         </GroupButton>
      </Container>
   );
};

export default CreateAndEditHr;
