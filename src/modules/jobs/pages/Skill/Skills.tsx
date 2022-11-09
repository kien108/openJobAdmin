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
import { useDeleteSkillMutation, useGetSkillByIdQuery } from "../../services";
import useFilter from "../../hooks/useFilter";
import { Col, Row } from "antd";

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
      isLoading: loadingSkills,
      isFetching: fetchingSkills,
   } = useGetSkillByIdQuery(
      {
         id,
         ...tableInstance.params,
         ...useFilter(),
      },
      {
         skip: !id,
         refetchOnMountOrArgChange: true,
      }
   );

   const [deleteSpecialization, { isLoading: loadingDeleteSpecialization }] =
      useDeleteSkillMutation();

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
         deleteSpecialization(selectedSkill.id)
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
                  message: t("common:ERRORS.SERVER_ERROR"),
               });
            });
   };

   useEffect(() => {
      if (!dataSkills) return;

      dataSkills &&
         setDataSource(
            dataSkills.map((item: any) => ({
               key: item.id,
               ...item,
            }))
         );
   }, [dataSkills]);

   return (
      <>
         <StyledHeader>
            {searchParams.get("specName") && (
               <Title>{`Manage skill of ${searchParams.get("specName")}`}</Title>
            )}
            <Button height={44} icon={<PlusIcon />} onClick={handleOpen}>
               {t("Create new skill")}
            </Button>
            <Button
               className="btn-close"
               onClick={() => {
                  navigate({
                     pathname: `/jobs/specializations`,
                  });
               }}
            >
               <CloseIcon />
            </Button>
         </StyledHeader>

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
