import React from "react";
import Chart from "react-apexcharts";
import { useGetAnalyticJobsQuery } from "../../services";
import { Spin } from "antd";

const JobsChart = () => {
   const { data, isFetching } = useGetAnalyticJobsQuery({}, { refetchOnMountOrArgChange: true });
   const options = {
      chart: {
         id: "basic-bar",
      },
      colors: ["#0043b5"],
      xaxis: {
         categories: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
         ],
      },
      title: {
         text: "Tin tuyển dụng trong năm (2023)",
         align: "center",
      },
   };

   const series = [
      {
         name: "Số lượng tin tuyển dụng",
         data: data?.amountOfJobs,
      },
   ];

   return (
      <Spin spinning={isFetching}>
         <Chart options={options} series={series} type="bar" width="100%" height={"500px"} />
      </Spin>
   );
};

export default JobsChart;
