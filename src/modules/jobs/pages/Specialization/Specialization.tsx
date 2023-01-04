import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledModal } from "../styles";
import {
   Button,
   DeleteIcon,
   EditIcon,
   EyeIcon,
   Input,
   Modal,
   openNotification,
   OptionType,
   SearchIcon,
   Select,
   Switch,
   Table,
} from "../../../../libs/components";

import { useModal } from "../../../../libs/common";
import { Header } from "../../components/Header";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import CreateAndEditSpecialization from "../../components/modal/CreateAndEditSpecialization";
import { GroupButton } from "../../components/modal/styles";
import {
   useDeleteSpecializationMutation,
   useGetMajorsQuery,
   useGetSpecializationsByIdQuery,
   useGetSpecializationsQuery,
} from "../../services";
import useFilter from "../../hooks/useFilter";
import { Col, Row } from "antd";
import { GiPowerLightning } from "react-icons/gi";

const Specialization = () => {
   const { t } = useTranslation();
   const navigate = useNavigate();
   const [selectedSpecialization, setSelectedSpecialization] = useState<any>(undefined);
   const [searchParams, setSearchParams] = useSearchParams();
   const [dataSource, setDataSource] = useState<any>([]);
   const [options, setOptions] = useState<OptionType[]>([]);

   const tableInstance = Table.useTable();

   const { isOpen, handleOpen, handleClose } = useModal();

   const form = useForm({
      defaultValues: {
         keyword: searchParams.get("keyword"),
         majorId: searchParams.get("majorId"),
      },
      resolver: yupResolver(
         yup.object({
            keyword: yup.string(),
         })
      ),
   });

   const {
      isOpen: isOpenDelete,
      handleClose: handleCloseDelete,
      handleOpen: handleOpenDeleteModal,
   } = useModal();

   const {
      data: dataSpecializations,
      isLoading: loadingSpecializations,
      isFetching: fetchingSpecializations,
   } = useGetSpecializationsQuery(
      {
         ...tableInstance.params,
         ...useFilter(),
      },
      {
         refetchOnMountOrArgChange: true,
         skip: !!form.watch("majorId"),
      }
   );

   const {
      data: dataFilterSpec,
      isLoading: loadingFilterSpec,
      isFetching: fetchingFilterSpec,
   } = useGetSpecializationsByIdQuery(
      {
         ...tableInstance.params,
         id: form.watch("majorId"),
      },
      {
         refetchOnMountOrArgChange: true,
         skip: !form.watch("majorId"),
      }
   );

   const {
      data: dataMajors,
      isLoading: loadingMajors,
      isFetching: fetchingMajors,
   } = useGetMajorsQuery({});

   const [deleteSpecialization, { isLoading: loadingDeleteSpecialization }] =
      useDeleteSpecializationMutation();

   const columns: ColumnsType<any> = [
      {
         title: t("Name"),
         dataIndex: "name",
         key: "name",
         sorter: true,
      },
      {
         title: t("adminManagement.actions"),
         dataIndex: "id",
         render: (_: string, item: any) => (
            <StyledFunctions>
               <BtnFunction
                  onClick={() => {
                     searchParams.set("specName", item.name);
                     setSelectedSpecialization(searchParams);
                     navigate({
                        pathname: `${item.id}`,
                        search: searchParams.toString(),
                     });
                  }}
               >
                  <GiPowerLightning size={20} />
               </BtnFunction>
               <BtnFunction onClick={() => handleOpenUpdate(item)}>
                  <EditIcon />
               </BtnFunction>
               <BtnFunction onClick={() => handleOpenDelete(item)}>
                  <DeleteIcon />
               </BtnFunction>
            </StyledFunctions>
         ),
      },
   ];

   const handleOpenUpdate = (Specialization: any) => {
      setSelectedSpecialization(Specialization);
      handleOpen();
   };

   const handleOpenDelete = (Specialization: any) => {
      setSelectedSpecialization(Specialization);

      handleOpenDeleteModal();
   };
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

   const handleConfirmDelete = () => {
      selectedSpecialization &&
         deleteSpecialization(selectedSpecialization.id)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Delete this Specialization successfully!!!"),
               });
               setSelectedSpecialization(undefined);
               handleCloseDelete();
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("Specialization already in use and can't be deleted"),
               });
               handleCloseDelete();
            });
   };

   useEffect(() => {
      if (form.watch("majorId")) {
         setDataSource(
            (dataFilterSpec ?? []).map((item: any) => ({
               key: item.id,
               ...item,
            }))
         );
      } else {
         setDataSource(
            (dataSpecializations ?? []).map((item: any) => ({
               key: item.id,
               ...item,
            }))
         );
      }
   }, [dataSpecializations, dataFilterSpec]);

   useEffect(() => {
      if (!dataMajors) return;

      const options = dataMajors.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => item.name,
      }));

      setOptions(options);
   }, [dataMajors]);
   return (
      <>
         <Header handleOpenCreate={handleOpen} title="Specialization Management" />
         <ContainerTable>
            <FormProvider {...form}>
               <Row gutter={[32, 32]}>
                  {/* <Col span={12}>
                     <Input
                        icons={<SearchIcon />}
                        name="keyword"
                        onChange={(e) => {
                           form.setValue("keyword", e.target.value);
                           handleOnChange("keyword", e.target.value);
                        }}
                        placeholder="Search by specialization name"
                     />
                  </Col> */}
                  <Col span={24}>
                     <Select
                        options={options}
                        name="majorId"
                        label={t("Major")}
                        onSelect={(value: any) => {
                           setValueToSearchParams("majorId", value);
                           form.setValue("majorId", value);
                        }}
                        onClear={() => setValueToSearchParams("majorId", "")}
                     />
                  </Col>
               </Row>
            </FormProvider>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingSpecializations || fetchingSpecializations}
               totalElements={0}
               totalPages={0}
            />
         </ContainerTable>
         <StyledModal
            title={
               selectedSpecialization ? t("Update Specialization") : t("Create new Specialization")
            }
            destroyOnClose
            open={isOpen}
            onCancel={() => {
               handleClose();
               setSelectedSpecialization(undefined);
            }}
         >
            <CreateAndEditSpecialization
               specialization={selectedSpecialization}
               handleClose={() => {
                  handleClose();
                  setSelectedSpecialization(undefined);
               }}
            />
         </StyledModal>
         <Modal
            type="confirm"
            open={isOpenDelete}
            onCancel={() => {
               searchParams.delete("id");
               setSearchParams(searchParams);
               handleCloseDelete();
            }}
            confirmIcon="?"
            title={t("Do to want to delete this specialization?")}
         >
            <GroupButton>
               <Button
                  height={44}
                  style={{ padding: "0 24px" }}
                  key="back"
                  border="outline"
                  onClick={() => {
                     setSelectedSpecialization(undefined);
                     handleCloseDelete();
                  }}
               >
                  {t("common:confirm.cancel")}
               </Button>
               <Button
                  height={44}
                  key="submit"
                  loading={loadingDeleteSpecialization}
                  onClick={handleConfirmDelete}
               >
                  {t(t("common:confirm.ok"))}
               </Button>
            </GroupButton>
         </Modal>
      </>
   );
};

export default Specialization;
