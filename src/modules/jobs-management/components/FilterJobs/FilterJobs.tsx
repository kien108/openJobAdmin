import { Button, Input, SearchIcon, Select } from "../../../../libs/components";
import { Col, Row } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import { useDebounce } from "../../../../libs/common";
import { useGetCompaniesQuery } from "../../services";

const FilterCompany = () => {
   const { t } = useTranslation();

   const [searchParams, setSearchParams] = useSearchParams();
   const [options, setOptions] = useState<any>([]);
   const [provinces, setProvinces] = useState<any>([]);
   const [searchLocation, setSearchLocation] = useState<any>("");

   const searchProvinceDebounce = useDebounce(searchLocation, 300);

   const defaultValues = useMemo(
      () => ({
         keyword: searchParams.get("keyword"),
         company: searchParams.get("company"),
      }),
      [searchParams]
   );

   const {
      data: dataCompanies,
      isLoading: loadingCompanies,
      isFetching: fetchingCompanies,
   } = useGetCompaniesQuery({ page: 0, size: 99 });

   const form = useForm({ defaultValues });

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
      if (!dataCompanies) return;

      const options = (dataCompanies?.companies ?? [])?.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => <span>{item?.name}</span>,
      }));

      setProvinces(options);
   }, [dataCompanies]);
   return (
      <FormProvider {...form}>
         <Row gutter={[30, 30]} align="middle">
            <Col span={14}>
               <Input
                  className="search"
                  title={t("companyName")}
                  placeholder="company name, job title"
                  icons={<SearchIcon width={20} />}
                  name="keyword"
                  onChange={(e: any) => {
                     form.setValue("keyword", e.target.value);
                     handleOnChange("keyword", e.target.value);
                  }}
               />
            </Col>
            <Col span={6}>
               <Select
                  name="company"
                  label={t("Company")}
                  required
                  showSearch
                  options={provinces || []}
                  onSearch={(value) => setSearchLocation(value)}
                  onChange={(value) => handleOnChange("company", value)}
                  loading={loadingCompanies || fetchingCompanies}
               />
            </Col>
         </Row>
      </FormProvider>
   );
};

export default FilterCompany;
