import React from "react";
import Chart from "react-apexcharts";
import {
   useGetAnalyticCVsQuery,
   useGetAnalyticJobsQuery,
   useGetCompaniesQuery,
} from "../../services";
import { Col, Row, Spin } from "antd";
import { Select } from "../../../../libs/components";
import { FormProvider, useForm } from "react-hook-form";

const CVsChart = () => {
   const { data: dataCompanies, isFetching: fetchingCompanies } = useGetCompaniesQuery({
      page: 0,
      size: 999,
   });
   const form = useForm({
      mode: "all",
      defaultValues: {
         companyId: "",
      },
   });

   const { data, isFetching } = useGetAnalyticCVsQuery(
      { companyId: form.getValues("companyId") },
      { refetchOnMountOrArgChange: true }
   );

   const options = {
      chart: {
         id: "basic-bar",
      },
      colors: ["#0043b5"],
      xaxis: {
         categories: (data ?? [])?.map((item) => item?.companyName),
      },
      title: {
         text: "Số lượng hồ sơ ứng tuyển vào top công ty (2023)",
         align: "center",
      },
   };

   const series = [
      {
         name: "Số lượng hồ sơ ứng tuyển",
         data: (data ?? [])?.map((item) => item?.amountOfCV),
      },
   ];

   return (
      <Spin spinning={isFetching}>
         <Row style={{ marginBottom: "30px" }}>
            <Col span={12}>
               <FormProvider {...form}>
                  <Select
                     required
                     name="companyId"
                     label="Công ty"
                     options={
                        dataCompanies?.companies?.map((item) => ({
                           key: item?.id,
                           label: item?.name,
                           value: item?.id,
                           render: () => item?.name,
                        })) || []
                     }
                     onChange={(value) => {
                        form.setValue("companyId", value, { shouldValidate: true });
                     }}
                  />
               </FormProvider>
            </Col>
         </Row>
         <Chart options={options} series={series} type="bar" width="100%" height={"450px"} />
      </Spin>
   );
};

export default CVsChart;
