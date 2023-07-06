import { Table, TextEllipsis, Title } from "../../../../libs/components";
import React, { useEffect, useState } from "react";
import { Content } from "./styles";
import { useTranslation } from "react-i18next";
import { JobsChart } from "../../components";
import { Col, Row } from "antd";
import { Outlet } from "react-router-dom";

const Invoice = () => {
   const { t } = useTranslation();
   const [dataSource, setDataSource] = useState<any>([]);
   const tableInstance = Table.useTable();

   return (
      <div>
         <Title>Phân tích số liệu</Title>
         <Content>
            <Outlet />
         </Content>
      </div>
   );
};

export default Invoice;
