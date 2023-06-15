import {
   Button,
   DateRangePicker,
   Input,
   SearchIcon,
   Select,
   Table,
} from "../../../../libs/components";
import { Col, Row, Spin } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import { useDebounce, convertEnumToArray, EStatus } from "../../../../libs/common";
import moment from "moment";
import { useGetProvincesQuery } from "../../services";
import { ECompanyType, EMemberTypes } from "../../../../types";

const formatDate = "DD/MM/YYYY";

const FilterCompany = () => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();

   const [searchParams, setSearchParams] = useSearchParams();
   const [options, setOptions] = useState<any>([]);
   const [provinces, setProvinces] = useState<any>([]);
   const [majors, setMajors] = useState<any>([]);
   const [specializations, setSpecializations] = useState<any>([]);
   const [searchLocation, setSearchLocation] = useState<any>("");

   const searchProvinceDebounce = useDebounce(searchLocation, 300);

   const defaultValues = useMemo(
      () => ({
         companyName: searchParams.get("companyName"),
         address: searchParams.get("address"),
         languages: searchParams.get("languages"),
         dates: searchParams.get("dates"),
         companyType: searchParams.get("companyType"),
         isActive: searchParams.get("isActive"),
         memberType: searchParams.get("memberType"),
      }),
      [searchParams]
   );

   const form = useForm({ defaultValues });

   const {
      data: dataProvinces,
      isLoading: loadingProvince,
      isFetching: fetchingProvinces,
   } = useGetProvincesQuery(
      { keyword: searchProvinceDebounce },
      { refetchOnMountOrArgChange: true }
   );
   const setValueToSearchParams = (name: string, value: string) => {
      if (value) {
         searchParams.set(name, value);
         setSearchParams(searchParams);
      } else {
         searchParams.delete(name);
         setSearchParams(searchParams);
      }
   };

   const handleOnChange = debounce(setValueToSearchParams, 500);

   useEffect(() => {
      const options = []?.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => <span>{item?.name}</span>,
      }));

      setMajors(options || []);
   }, []);

   useEffect(() => {
      const options = []?.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => <span>{item?.name}</span>,
      }));

      setSpecializations(options || []);
   }, []);

   const handleChangeDate = (key: string, value: any) => {
      let dateFormat;
      if (value) {
         dateFormat = value?.map((item: any) => moment(item._d).format(formatDate));
         searchParams.set(key, encodeURI(dateFormat.join(" - ")));
         setSearchParams(searchParams);
      }
      tableInstance.setParams((prev) => {
         return {
            ...prev,
            page: 0,
         };
      });
      if (!value || value.length === 0) {
         searchParams.delete(key);
         setSearchParams(searchParams);
      }
   };

   const statuses = useMemo(
      () =>
         convertEnumToArray(EStatus).map((item) => ({
            key: item?.id,
            label: item?.key,
            value: item?.value,
            render: () => item?.key,
         })),
      []
   );

   useEffect(() => {
      if (!dataProvinces) return;

      const options = dataProvinces.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.name,
         render: () => <span>{item?.name}</span>,
      }));

      setProvinces(options);
   }, [dataProvinces]);

   useEffect(() => {
      form.reset(defaultValues);
   }, [searchParams.toString()]);
   return (
      <FormProvider {...form}>
         <Row gutter={[20, 20]} align="middle">
            <Col span={16}>
               <Input
                  className="search"
                  title={t("companyName")}
                  placeholder="Tên công ty"
                  icons={<SearchIcon width={20} />}
                  name="companyName"
                  onChange={(e: any) => {
                     form.setValue("companyName", e.target.value);
                     handleOnChange("companyName", e.target.value);
                  }}
               />
            </Col>
            <Col span={8}>
               <DateRangePicker
                  format={formatDate}
                  name="dates"
                  label={"Ngày đăng ký"}
                  value={
                     form.getValues("dates")
                        ? [
                             moment(form.getValues("dates")?.split("%20-%20")[0], formatDate),
                             moment(form.getValues("dates")?.split("%20-%20")[1], formatDate),
                          ]
                        : undefined
                  }
                  onChange={(value) => {
                     const dateFormat = value
                        ? value.map((item: any) => moment(item._d).format(formatDate))
                        : null;
                     form.setValue(
                        "dates",
                        dateFormat ? encodeURI(`${dateFormat[0]} - ${dateFormat[1]}`) : null
                     );
                     handleChangeDate("dates", value);
                  }}
               />
            </Col>
         </Row>
      </FormProvider>
   );
};

export default FilterCompany;
