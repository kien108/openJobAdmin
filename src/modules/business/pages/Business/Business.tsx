import React, { useEffect } from "react";
import { Container, Content } from "./styles";
import { Button, Input, Title, openNotification } from "../../../../libs/components";
import { FormProvider, useForm } from "react-hook-form";
import { Col, Row, Spin } from "antd";
import { convertPrice, revertPrice } from "../../../../utils";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useGetBusinessQuery, useUpdateBusinessMutation } from "../../services";

const Business = () => {
   const { t } = useTranslation();

   const form = useForm({
      defaultValues: {
         freeCvView: "",
         freeJob: "",
         premiumFreeJob: "",
         premiumFreeViewCv: "",
         baseCvViewPrice: "",
         baseJobPricePerDay: "",
         maxTimeForFreeJobInDays: "",
         premiumPrice: "",
         internWeight: "",
         fresherWeight: "",
         juniorWeight: "",
         middleWeight: "",
         seniorWeight: "",
         highPositionWeight: "",
      },
      resolver: yupResolver(
         yup.object({
            freeCvView: yup.string().required("Trường này không được để trống!"),
            freeJob: yup.string().required("Trường này không được để trống!"),
            premiumFreeJob: yup.string().required("Trường này không được để trống!"),
            premiumFreeViewCv: yup.string().required("Trường này không được để trống!"),
            baseCvViewPrice: yup.string().required("Trường này không được để trống!"),
            baseJobPricePerDay: yup.string().required("Trường này không được để trống!"),
            maxTimeForFreeJobInDays: yup.string().required("Trường này không được để trống!"),
            premiumPrice: yup.string().required("Trường này không được để trống!"),
            internWeight: yup.string().required("Trường này không được để trống!"),
            fresherWeight: yup.string().required("Trường này không được để trống!"),
            juniorWeight: yup.string().required("Trường này không được để trống!"),
            middleWeight: yup.string().required("Trường này không được để trống!"),
            seniorWeight: yup.string().required("Trường này không được để trống!"),
            highPositionWeight: yup.string().required("Trường này không được để trống!"),
         })
      ),
   });

   const { data: dataBusiness, isFetching: fetchingBusiness } = useGetBusinessQuery();
   const [update, { isLoading: loadingCreate }] = useUpdateBusinessMutation();

   const submit = (data) => {
      const payload = {
         freeCvView: revertPrice(data?.freeCvView),
         freeJob: revertPrice(data?.freeJob),
         premiumFreeJob: revertPrice(data?.premiumFreeJob),
         premiumFreeViewCv: revertPrice(data?.premiumFreeViewCv),
         baseCvViewPrice: revertPrice(data?.baseCvViewPrice),
         baseJobPricePerDay: revertPrice(data?.baseJobPricePerDay),
         maxTimeForFreeJobInDays: revertPrice(data?.maxTimeForFreeJobInDays),
         premiumPrice: revertPrice(data?.premiumPrice),
         internWeight: parseFloat(data?.internWeight?.replaceAll(",", ".")),
         fresherWeight: parseFloat(data?.fresherWeight?.replaceAll(",", ".")),
         juniorWeight: parseFloat(data?.juniorWeight?.replaceAll(",", ".")),
         middleWeight: parseFloat(data?.middleWeight?.replaceAll(",", ".")),
         seniorWeight: parseFloat(data?.seniorWeight?.replaceAll(",", ".")),
         highPositionWeight: parseFloat(data?.highPositionWeight?.replaceAll(",", ".")),
      };

      update(payload)
         .unwrap()
         .then(() => {
            openNotification({
               type: "success",
               message: t("Cập nhật dịch vụ thành công!!!"),
            });
         })
         .catch((error) => {
            openNotification({
               type: "error",
               message: t("common:ERRORS.SERVER_ERROR"),
            });
         });
   };

   useEffect(() => {
      if (!dataBusiness) return;

      const { reset } = form;

      const fieldsReset = {
         ...dataBusiness,
         freeCvView: convertPrice(dataBusiness?.freeCvView),
         freeJob: convertPrice(dataBusiness?.freeJob),
         premiumFreeJob: convertPrice(dataBusiness?.premiumFreeJob),
         premiumFreeViewCv: convertPrice(dataBusiness?.premiumFreeViewCv),
         baseCvViewPrice: convertPrice(dataBusiness?.baseCvViewPrice),
         baseJobPricePerDay: convertPrice(dataBusiness?.baseJobPricePerDay),
         maxTimeForFreeJobInDays: convertPrice(dataBusiness?.maxTimeForFreeJobInDays),
         premiumPrice: convertPrice(dataBusiness?.premiumPrice),
      };

      reset(fieldsReset);
   }, [dataBusiness]);

   return (
      <Spin spinning={fetchingBusiness || loadingCreate}>
         <Container>
            <Title>Dịch vụ công ty</Title>

            <FormProvider {...form}>
               <Content>
                  <span className="section">Gói hội viên</span>
                  <Row gutter={[20, 20]} className="section-content">
                     <Col push={6} span={9} className="label">
                        Lượt xem hồ sơ miễn phí
                        <span className="required">*</span>
                     </Col>
                     <Col push={6} span={9} className="label">
                        Lượt đăng tin tuyển dụng miễn phí
                        <span className="required">*</span>
                     </Col>
                  </Row>
                  <Row gutter={[20, 20]} className="section-content">
                     <Col className="label" span={6}>
                        Phổ thông
                     </Col>
                     <Col span={9}>
                        <Input
                           type="number"
                           name="freeCvView"
                           placeholder="Nhập giá trị..."
                           onChange={(e) => {
                              form.setValue("freeCvView", convertPrice(e.target.value), {
                                 shouldValidate: true,
                              });
                           }}
                           allowClear
                        />
                     </Col>
                     <Col span={9}>
                        <Input
                           type="number"
                           name="freeJob"
                           placeholder="Nhập giá trị..."
                           onChange={(e) => {
                              form.setValue("freeJob", convertPrice(e.target.value), {
                                 shouldValidate: true,
                              });
                           }}
                           allowClear
                        />
                     </Col>
                  </Row>
                  <Row gutter={[20, 20]} className="section-content">
                     <Col className="label" span={6}>
                        VIP
                     </Col>
                     <Col span={9}>
                        <Input
                           type="number"
                           name="premiumFreeJob"
                           placeholder="Nhập giá trị..."
                           onChange={(e) => {
                              form.setValue("premiumFreeJob", convertPrice(e.target.value), {
                                 shouldValidate: true,
                              });
                           }}
                           allowClear
                        />
                     </Col>
                     <Col span={9}>
                        <Input
                           type="number"
                           name="premiumFreeViewCv"
                           placeholder="Nhập giá trị..."
                           onChange={(e) => {
                              form.setValue("premiumFreeViewCv", convertPrice(e.target.value), {
                                 shouldValidate: true,
                              });
                           }}
                           allowClear
                        />
                     </Col>
                  </Row>

                  <span className="section mt-2">Thông số</span>
                  <Row gutter={[20, 20]}>
                     <Col span={8}>
                        <Input
                           type="number"
                           name="baseCvViewPrice"
                           label="Giá tiền xem hồ sơ"
                           required
                           placeholder="Nhập giá trị..."
                           onChange={(e) => {
                              form.setValue("baseCvViewPrice", convertPrice(e.target.value), {
                                 shouldValidate: true,
                              });
                           }}
                           allowClear
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           type="number"
                           name="baseJobPricePerDay"
                           label="Giá tiền đăng tin theo ngày"
                           required
                           placeholder="Nhập giá trị..."
                           onChange={(e) => {
                              form.setValue("baseJobPricePerDay", convertPrice(e.target.value), {
                                 shouldValidate: true,
                              });
                           }}
                           allowClear
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           type="number"
                           name="maxTimeForFreeJobInDays"
                           label="Thời gian tối đa cho tin miễn phí (ngày)"
                           required
                           placeholder="Nhập giá trị..."
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           type="number"
                           name="premiumPrice"
                           label="Giá tiền gói hội viên cao cấp"
                           required
                           placeholder="Nhập giá trị..."
                           onChange={(e) => {
                              form.setValue("premiumPrice", convertPrice(e.target.value), {
                                 shouldValidate: true,
                              });
                           }}
                           allowClear
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           name="internWeight"
                           label="Trọng số vị trí thực tập"
                           required
                           placeholder="Nhập giá trị..."
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           name="fresherWeight"
                           label="Trọng số vị trí fresher"
                           required
                           placeholder="Nhập giá trị..."
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           name="juniorWeight"
                           label="Trọng số vị trí junior"
                           required
                           placeholder="Nhập giá trị..."
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           name="middleWeight"
                           label="Trọng số vị trí middle"
                           required
                           placeholder="Nhập giá trị..."
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           name="seniorWeight"
                           label="Trọng số vị trí senior"
                           required
                           placeholder="Nhập giá trị..."
                        />
                     </Col>
                     <Col span={8}>
                        <Input
                           name="highPositionWeight"
                           label="Trọng số vị trí cao cấp"
                           required
                           placeholder="Nhập giá trị..."
                        />
                     </Col>
                  </Row>

                  <Button
                     loading={loadingCreate}
                     className="btn-save"
                     onClick={() => form.handleSubmit(submit)()}
                  >
                     Lưu
                  </Button>
               </Content>
            </FormProvider>
         </Container>
      </Spin>
   );
};

export default Business;
