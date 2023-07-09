import React from "react";
import Chart from "react-apexcharts";
import { useGetAnalyticJobsQuery, useGetAnalyticUsersQuery } from "../../services";
import { Spin } from "antd";

const UsersChart = () => {
   const { data, isFetching } = useGetAnalyticUsersQuery({}, { refetchOnMountOrArgChange: true });
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
         text: "Người dùng đăng ký mới (2023)",
         align: "center",
      },
   };

   const series = [
      {
         name: "Số lượng người dùng đăng ký",
         data: data?.amountOfUsers,
      },
   ];

   return (
      <Spin spinning={isFetching}>
         <Chart options={options} series={series} type="bar" width="100%" height={"500px"} />
      </Spin>
   );
};

export default UsersChart;
