import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BtnFunction, ContainerTable, StyledFunctions, StyledModal } from "../styles";
import {
   Button,
   DeleteIcon,
   EditIcon,
   EyeIcon,
   Header,
   Input,
   Modal,
   openNotification,
   OptionType,
   SearchIcon,
   Select,
   Switch,
   Table,
   Title,
} from "../../../../libs/components";

import { useModal } from "../../../../libs/common";

import { useNavigate, useSearchParams } from "react-router-dom";

import { GroupButton } from "../../components/modal/styles";
import { useGetSkillInvalidateQuery, useValidateSkillMutation } from "../../services";

import { BsCheckCircle } from "react-icons/bs";
import { StyledHeader } from "./styles";

const SkillInvalidate = () => {
   const { t } = useTranslation();
   const navigate = useNavigate();
   const [selectedId, setSelectedId] = useState<any>(undefined);
   const [searchParams, setSearchParams] = useSearchParams();
   const [dataSource, setDataSource] = useState<any>([]);
   const [selectedKeys, setSelectedKeys] = useState<any>([]);

   const tableInstance = Table.useTable();

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

   const [validate, { isLoading: loadingValidate }] = useValidateSkillMutation();

   const columns: ColumnsType<any> = [
      {
         title: t("Tên kỹ năng"),
         dataIndex: "name",
         key: "name",
         sorter: true,
      },
      {
         title: t("Chuyên ngành"),
         dataIndex: "major",
         key: "major",
         sorter: true,
      },
      {
         title: "Chuyên ngành hẹp",
         dataIndex: "specialization",
         key: "specialization",
         sorter: true,
      },
      {
         title: "Chức năng",
         align: "center",
         dataIndex: "id",
         render: (_: string, item: any) => (
            <StyledFunctions>
               <BtnFunction onClick={() => handleOpenDelete(item?.id)}>
                  <BsCheckCircle size={28} />
               </BtnFunction>
            </StyledFunctions>
         ),
      },
   ];

   const handleOpenDelete = (Specialization: any) => {
      setSelectedId(Specialization);

      handleOpenDeleteModal();
   };

   const handleConfirmDelete = () => {
      selectedId &&
         validate({ skillIds: [selectedId] })
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Xác thực kỹ năng thành công !!!"),
               });
               setSelectedId(undefined);
               handleCloseDelete();
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("INTERNAL SERVER ERROR"),
               });
               handleCloseDelete();
            });
   };

   useEffect(() => {
      const dataSources = (dataSkills?.listSkill ?? [])?.map((item: any) => ({
         key: item.id,
         ...item,
      }));

      setDataSource(dataSources);
   }, [dataSkills]);

   const rowSelection = {
      selectedKeys,
      onChange: (selectedRowKeys: React.Key[], selectedRows) => {
         setSelectedKeys(selectedRowKeys);
      },
   };

   const handleBulkValidate = () => {
      validate({
         skillIds: selectedKeys,
      })
         .unwrap()
         .then(() => {
            openNotification({
               type: "success",
               message: t("Xác thực kỹ năng hàng loạt thành công !!!"),
            });
            setSelectedId(undefined);
            handleCloseDelete();
         })
         .catch((error) => {
            openNotification({
               type: "error",
               message: t("INTERNAL SERVER ERROR"),
            });
            handleCloseDelete();
         });
   };

   return (
      <>
         <StyledHeader>
            <Title>Quản lý xác thực kỹ năng</Title>
            <Button disabled={selectedKeys.length === 0} onClick={handleBulkValidate}>
               Xác thực hàng loạt
            </Button>
         </StyledHeader>
         <ContainerTable>
            <Table
               columns={columns}
               dataSource={dataSource}
               tableInstance={tableInstance}
               loading={loadingMajors || fetchingMajors}
               totalElements={dataSkills?.totalElements || 0}
               totalPages={dataSkills?.totalPages || 0}
               rowKey={(row) => row?.key}
               rowSelection={rowSelection}
            />
         </ContainerTable>

         <Modal
            type="confirm"
            open={isOpenDelete}
            onCancel={() => {
               searchParams.delete("id");
               setSearchParams(searchParams);
               handleCloseDelete();
            }}
            confirmIcon="?"
            title={t("Bạn có muốn xác thực kỹ năng này không ?")}
         >
            <GroupButton>
               <Button
                  height={44}
                  style={{ padding: "0 24px" }}
                  key="back"
                  border="outline"
                  onClick={() => {
                     setSelectedId(undefined);
                     handleCloseDelete();
                  }}
               >
                  {t("common:confirm.cancel")}
               </Button>
               <Button
                  height={44}
                  key="submit"
                  loading={loadingValidate}
                  onClick={handleConfirmDelete}
               >
                  Xác thực
               </Button>
            </GroupButton>
         </Modal>
      </>
   );
};

export default SkillInvalidate;
