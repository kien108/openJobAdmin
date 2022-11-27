import React, { FC, useState } from "react";

import { DeleteIcon, EditIcon, Modal, Switch, Table } from "../../../../libs/components";

import { BtnFunction, StyledFunctions, StyledEmailContent } from "./styles";

import { useTranslation } from "react-i18next";

// import { useGetTemplatesQuery } from "../../services/AccountApp";

import { useToggle } from "../../hooks";
import { DeleteEmail } from "../modal";
import { ISetting, ITemplateItem } from "../../types";
import { useGetSettingsQuery } from "../../services";
import { useEffect } from "react";

interface EmailContentProps {
   selectedEmail: (email: ISetting) => void;
   handleOpenEdit: () => void;
}

const EmailContent: FC<EmailContentProps> = ({ selectedEmail, handleOpenEdit }) => {
   const { t } = useTranslation();
   const tableInstance = Table.useTable();
   const [dataSource, setDataSource] = useState<any>([]);

   const {
      data: dataSettings,
      isLoading: isLoadTemplates,
      isFetching: isFetchTemplates,
   } = useGetSettingsQuery(
      {
         ...tableInstance.params,
      },
      {
         refetchOnMountOrArgChange: true,
      }
   );

   const [selectedWorkFlowId, setSelectedWorkFlowId] = useState<string>("");

   const [openDelete, toggleOpenDelete] = useToggle();

   // const templates = data?.data;

   useEffect(() => {
      if (!dataSettings) return;

      const dataSource = dataSettings.filter((item) => item.extraValue);
      setDataSource(dataSource);
   }, [dataSettings]);
   // const dataSource =
   //    templates?.items && templates?.items.length > 0
   //       ? templates.items.map((item) => ({
   //            key: item.id,
   //            email: item,
   //            ...item,
   //         }))
   //       : [];

   const handleOpenUpdate = (email: ISetting) => {
      handleOpenEdit();
      selectedEmail(email);
   };

   const handleDelete = (email: ISetting) => {
      toggleOpenDelete();
      setSelectedWorkFlowId(email.id);
   };

   const columns = [
      {
         title: t("Name"),
         dataIndex: "name",
         sorter: true,
      },
      {
         title: t("Value"),
         dataIndex: "value",
         sorter: true,
      },
      {
         title: t("Functions"),
         dataIndex: "email",
         render: (_: string, email: ISetting) => (
            <StyledFunctions>
               <BtnFunction onClick={() => handleOpenUpdate(email)}>
                  <EditIcon />
               </BtnFunction>

               <BtnFunction onClick={() => handleDelete(email)}>
                  <DeleteIcon />
               </BtnFunction>
            </StyledFunctions>
         ),
      },
   ];

   return (
      <StyledEmailContent>
         <Table
            tableInstance={tableInstance}
            columns={columns}
            dataSource={dataSource}
            totalItems={0}
            totalPages={0}
            totalElements={0}
            loading={isLoadTemplates || isFetchTemplates}
         />
         <Modal
            type="confirm"
            visible={openDelete}
            onCancel={toggleOpenDelete}
            confirmIcon="?"
            title={t("Are you sure to delete this email")}
         >
            <DeleteEmail handleClose={toggleOpenDelete} id={selectedWorkFlowId} />
         </Modal>
      </StyledEmailContent>
   );
};

export default EmailContent;
