import React, { FC } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import logoCompany from "../../assets/company.png";
import { Col, Row, Spin, Tabs } from "antd";
import { AiOutlineClockCircle, AiOutlinePhone, AiOutlineSetting } from "react-icons/ai";
import { BsCalendarDay, BsPeople } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { Button } from "../../../../libs/components";
import { Container } from "./styles";
import Parser from "html-react-parser";
import { useTranslation } from "react-i18next";
import { useGetByIdQuery } from "../../services";

interface IProps {
   handleClose: () => void;
}
const CompanyDetail: FC<IProps> = ({ handleClose }) => {
   const { id } = useParams();
   const { t } = useTranslation();
   const [searchParams, setSearchParams] = useSearchParams();

   const {
      data: dataCompany,
      isLoading: loadingCompany,
      isFetching: fetchingCompany,
   } = useGetByIdQuery(searchParams.get("id")!, {
      skip: !searchParams.get("id"),
      refetchOnMountOrArgChange: true,
   });

   return (
      <Spin spinning={loadingCompany || fetchingCompany}>
         <Container>
            <div className="company-header">
               <div className="header">
                  <div className="logo">
                     <img src={dataCompany?.company?.logoUrl} alt="" />
                  </div>
                  <div className="right">
                     <span className="name">{dataCompany?.company?.name}</span>
                     <div className="content">
                        <Row gutter={[10, 10]}>
                           <Col span={6}>
                              <div className="item">
                                 <AiOutlineSetting size={17} />
                                 <span>Product</span>
                              </div>
                              <div className="item">
                                 <BsCalendarDay size={17} />
                                 <span>Thứ 2 - Thứ 6</span>
                              </div>
                              <div className="item">
                                 <AiOutlineClockCircle size={17} />
                                 <span>Không OT</span>
                              </div>
                           </Col>
                           <Col span={6}>
                              <div className="item">
                                 <AiOutlinePhone size={17} />
                                 <span>{dataCompany?.company?.phone}</span>
                              </div>
                              <div className="item">
                                 <BsPeople size={17} />
                                 <span>{dataCompany?.company?.totalEmployee}</span>
                              </div>
                           </Col>
                           <Col span={8}>
                              <div className="item">
                                 <GrLocation size={17} />
                                 <span>{dataCompany?.company?.address}</span>
                              </div>
                           </Col>
                        </Row>
                     </div>
                  </div>
               </div>
               <div className="description">
                  <span className="title">About Company</span>
                  {Parser(`${dataCompany?.company?.description}`)}
               </div>
            </div>

            <Button
               style={{ margin: "10px auto" }}
               onClick={() => {
                  handleClose();
               }}
            >
               {t("Back")}
            </Button>
         </Container>
      </Spin>
   );
};

export default CompanyDetail;
