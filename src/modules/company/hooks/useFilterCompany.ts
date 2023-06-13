import { useEffect, useState } from "react";
import moment from "moment/moment";
import { useSearchParams } from "react-router-dom";
import { EStatus } from "../../../libs/common";

interface ParamsDate {
   name?: any;
   startDate?: any;
   endDate?: any;
   address?: any;
   memberType?: any;
   companyType?: any;
   isActive?: any;
}

const useFilterCompany = () => {
   const date = new Date();
   const firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("DD/MM/YYYY");
   const lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format(
      "DD/MM/YYYY"
   );
   const [searchParams, setSearchParams] = useSearchParams();
   const [params, setParams] = useState<ParamsDate>({});

   useEffect(() => {
      if (searchParams.get("dates")) {
         setSearchParams(searchParams);
      } else {
         searchParams.set("dates", encodeURI(`${firstDay} - ${lastDay}`));
      }
      if (searchParams.get("name")) {
         searchParams.set("name", searchParams.get("name") || "");
      }
      setSearchParams(searchParams);
   }, []);

   useEffect(() => {
      searchParams.get("dates")
         ? setParams((prev) => ({
              ...prev,
              startDate: moment(
                 searchParams.get("dates")?.split("%20-%20")[0],
                 "DD/MM/YYYY"
              ).format("YYYY-MM-DD"),
              endDate: moment(searchParams.get("dates")?.split("%20-%20")[1], "DD/MM/YYYY")
                 .format("YYYY-MM-DD")
                 .toString(),
           }))
         : setParams((prev) => {
              delete prev.startDate;
              delete prev.endDate;
              return { ...prev };
           });

      searchParams.get("name")
         ? setParams((prev) => ({
              ...prev,
              name: searchParams.get("name"),
           }))
         : setParams((prev) => {
              delete prev.name;
              return { ...prev };
           });

      searchParams.get("address")
         ? setParams((prev) => ({
              ...prev,
              address: searchParams.get("address"),
           }))
         : setParams((prev) => {
              delete prev.address;
              return { ...prev };
           });

      searchParams.get("companyType")
         ? setParams((prev) => ({
              ...prev,
              companyType: searchParams.get("companyType"),
           }))
         : setParams((prev) => {
              delete prev.companyType;
              return { ...prev };
           });

      searchParams.get("memberType")
         ? setParams((prev) => ({
              ...prev,
              memberType: searchParams.get("memberType"),
           }))
         : setParams((prev) => {
              delete prev.memberType;
              return { ...prev };
           });

      searchParams.get("isActive")
         ? setParams((prev) => ({
              ...prev,
              isActive: !!(searchParams.get("isActive") === EStatus.Active),
           }))
         : setParams((prev) => {
              delete prev.isActive;
              return { ...prev };
           });
   }, [searchParams.toString()]);

   return params;
};

export default useFilterCompany;
