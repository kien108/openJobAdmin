import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledHeader, StyledModal } from "../styles";
import {
   Button,
   CloseIcon,
   DeleteIcon,
   EditIcon,
   Input,
   Modal,
   openNotification,
   OptionType,
   PlusIcon,
   SearchIcon,
   Select,
   Switch,
   Table,
   Title,
} from "../../../../libs/components";

import { useModal } from "../../../../libs/common";
import { Header } from "../../components/Header";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import CreateAndEditSkill from "../../components/modal/CreateAndEditSkill";
import { GroupButton } from "../../components/modal/styles";
import { useDeleteSkillMutation, useGetSkillByIdQuery, useGetSkillsQuery } from "../../services";
import useFilter from "../../hooks/useFilter";
import { Col, Row } from "antd";
import { FilterSkill } from "../../components";

const Skills = () => {
   const { t } = useTranslation();
   const [selectedSkill, setSelectedSkill] = useState<any>(undefined);
   const [searchParams, setSearchParams] = useSearchParams();
   const [dataSource, setDataSource] = useState<any>([]);
   const navigate = useNavigate();

   const [options, setOptions] = useState<OptionType[]>([]);
   const { id } = useParams();

   const tableInstance = Table.useTable();

   const { isOpen, handleOpen, handleClose } = useModal();

   const form = useForm({
      defaultValues: {
         keyword: searchParams.get("keyword"),
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
      isLoading: loadingSkills,
      isFetching: fetchingSkills,
   } = useGetSkillsQuery(
      {
         ...tableInstance.params,
         ...useFilter(),
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const [deleteSpecialization, { isLoading: loadingDeleteSpecialization }] =
      useDeleteSkillMutation();

   const columns: ColumnsType<any> = [
      {
         title: "Tên kỹ năng",
         dataIndex: "name",
         key: "name",
         sorter: true,
      },
      {
         title: "Chức năng",
         dataIndex: "id",
         align: "center",
         render: (_: string, item: any) => (
            <StyledFunctions>
               <BtnFunction onClick={() => handleOpenUpdate(item)}>
                  <EditIcon />
               </BtnFunction>
               {/* <BtnFunction onClick={() => handleOpenDelete(item)}>
                  <DeleteIcon />
               </BtnFunction> */}
            </StyledFunctions>
         ),
      },
   ];

   const handleOpenUpdate = (skill: any) => {
      setSelectedSkill(skill);
      handleOpen();
   };

   const handleOpenDelete = (skill: any) => {
      setSelectedSkill(skill);

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
      selectedSkill &&
         deleteSpecialization(selectedSkill?.name)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Delete this Specialization successfully!!!"),
               });
               setSelectedSkill(undefined);
               handleCloseDelete();
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("Skill already in use and can't be deleted"),
               });
               handleCloseDelete();
            });
   };

   useEffect(() => {
      setDataSource(
         (dataSkills?.content ?? [])?.map((item: any) => ({
            key: item.id,
            ...item,
         }))
      );
   }, [dataSkills]);

   return (
      <>
         <Header handleOpenCreate={handleOpen} title="Quản lý kỹ năng" />

         <ContainerTable>
            <FormProvider {...form}>
               <FilterSkill />
            </FormProvider>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingSkills || fetchingSkills}
               totalElements={0}
               totalPages={0}
            />
         </ContainerTable>
         <StyledModal
            title={selectedSkill ? t("Update skill") : t("Create new skill")}
            destroyOnClose
            open={isOpen}
            onCancel={() => {
               handleClose();
               setSelectedSkill(undefined);
            }}
         >
            <CreateAndEditSkill
               skill={selectedSkill}
               handleClose={() => {
                  handleClose();
                  setSelectedSkill(undefined);
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
            title={t("Do to want to delete this skill?")}
         >
            <GroupButton>
               <Button
                  height={44}
                  style={{ padding: "0 24px" }}
                  key="back"
                  border="outline"
                  onClick={() => {
                     setSelectedSkill(undefined);
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

export default Skills;
