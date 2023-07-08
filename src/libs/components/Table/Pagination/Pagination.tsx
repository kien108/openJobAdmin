import { Pagination as PaginationAntd, PaginationProps as AntPaginationProps, Popover } from "antd";
import { useEffect, useState } from "react";
import { StyledPagination } from "./styles";

import "./styles.scss";
import { CheckIcon } from "../../../components";
import { theme } from "../../../common";
import { TableInstanceProps } from "../Table";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

interface PaginationProps extends AntPaginationProps {
   totalElements: number;
   tableInstance: TableInstanceProps;
}

const optionsShowPage: number[] = [10, 20, 50, 100];

export default function Pagination({ tableInstance, ...props }: PaginationProps) {
   const { t } = useTranslation();
   const [visible, setVisible] = useState(false);
   const [numberActive, setNumberActive] = useState<number>(10);
   const [searchParams, setSearchParams] = useSearchParams();

   const selectOption = (size: number) => {
      setNumberActive(size);
      tableInstance.searchParams.set("size", size);
      tableInstance.searchParams.set("page", 0);
      tableInstance.setSearchParams(tableInstance.searchParams);

      tableInstance.setParams((prev: any) => {
         return {
            ...prev,
            page: 0,
         };
      });
      tableInstance.setSearchParams(tableInstance.searchParams);

      tableInstance.setParams((prev: any) => {
         return {
            ...prev,
            size: size,
         };
      });
      setVisible(false);
   };

   useEffect(() => {
      searchParams.set("size", numberActive.toString());
      setSearchParams(searchParams);
   }, [numberActive]);
   const handleVisibleChange = (newVisible: boolean) => {
      setVisible(newVisible);
   };

   const onChange = (page: number) => {
      tableInstance.searchParams.set("page", page - 1);
      tableInstance.setSearchParams(tableInstance.searchParams);

      tableInstance.setParams((prev: any) => {
         return {
            ...prev,
            page: page - 1,
         };
      });
   };

   const content = (
      <ul className="options-show">
         {optionsShowPage.map((size, index) => (
            <li className="option" key={index} onClick={() => selectOption(size)}>
               <span>{size}</span>
               {size === numberActive && (
                  <i className="icon-check">
                     <CheckIcon />
                  </i>
               )}
            </li>
         ))}
      </ul>
   );

   return (
      <StyledPagination theme={theme}>
         <div className="total-page">
            <span className="total">
               Trang
               <span className="page-current"> {props.total}</span>
            </span>
         </div>
         <div className="pagination-content">
            <PaginationAntd
               {...props}
               total={props.totalElements}
               showTotal={(total, range) => {
                  return (
                     <span className="text">
                        Số dòng mỗi trang
                        <Popover
                           overlayClassName="styled-popover"
                           content={content}
                           trigger="click"
                           visible={visible}
                           onVisibleChange={handleVisibleChange}
                        >
                           <span className="page-number">
                              {" "}
                              {range[0]}-{range[1]}{" "}
                           </span>
                        </Popover>
                        trên
                        <span className="page-total"> {props.totalElements}</span>
                     </span>
                  );
               }}
               pageSize={tableInstance.params.size}
               current={tableInstance.params.page + 1}
               onChange={onChange}
            />
         </div>
      </StyledPagination>
   );
}
