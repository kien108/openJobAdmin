import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
   useGetAnalyticCVsQuery,
   useGetAnalyticIncomeQuery,
   useGetAnalyticJobsQuery,
} from "../../services";
import { Spin } from "antd";

const EIncomeTypes = {
   JOB_POST: "Đăng tin tuyển dụng",
   VIEW_CV: "Xem hồ sơ ứng viên",
   UPGRADE_MEMBERSHIP: "Nâng cấp gói hội viên",
};
const IncomeChart = () => {
   const { data, isFetching } = useGetAnalyticIncomeQuery({}, { refetchOnMountOrArgChange: true });
   const [formatData, setFormatData] = useState<any>(undefined);

   const options = {
      chart: {
         width: 380,
         type: "pie",
      },
      title: {
         text: "Nguồn thu của OpenJobs (2023)",
         align: "center",
         color: "#0043b5",
      },
      labels: Object.entries(data ?? [])?.map((item) => EIncomeTypes?.[item[0]] as any),
      responsive: [
         {
            breakpoint: 480,
            options: {
               chart: {
                  width: 200,
               },
               legend: {
                  position: "bottom",
               },
            },
         },
      ],
   };

   const series = Object.entries(data ?? [])?.map((item) => item[1]);

   return (
      <Spin spinning={isFetching}>
         <Chart options={options} series={series} type="pie" width="70%" height={"500px"} />
      </Spin>
   );
};

export default IncomeChart;
