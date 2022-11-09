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
   useGetSkillInvalidateQuery,
   useGetSpecializationsQuery,
} from "../../services";
import useFilter from "../../hooks/useFilter";
import { Col, Row } from "antd";

const SkillInvalidate = () => {
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
      data: dataSkills,
      isLoading: loadingMajors,
      isFetching: fetchingMajors,
   } = useGetSkillInvalidateQuery({ ...tableInstance.params }, { refetchOnMountOrArgChange: true });

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
                  <EyeIcon />
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
                  message: t("common:ERRORS.SERVER_ERROR"),
               });
            });
   };

   useEffect(() => {
      if (!dataSkills) return;

      console.log(dataSkills);

      const options = dataSkills.map((item: any) => ({
         key: item.id,
         label: item.name,
         value: item.id,
         render: () => item.name,
      }));

      setOptions(options);
   }, [dataSkills]);
   return (
      <>
         <Header handleOpenCreate={handleOpen} title="Specialization Management" />
         <ContainerTable>
            <FormProvider {...form}>
               <Input
                  icons={<SearchIcon />}
                  name="keyword"
                  onChange={(e) => {
                     form.setValue("keyword", e.target.value);
                     handleOnChange("keyword", e.target.value);
                  }}
                  placeholder="Search by skill name"
               />
            </FormProvider>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingMajors || fetchingMajors}
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

export default SkillInvalidate;
