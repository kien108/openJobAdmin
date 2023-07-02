import React, { FC, useState } from "react";

import {
   DeleteIcon,
   EditIcon,
   Modal,
   Switch,
   Table,
   TextEllipsis,
} from "../../../../libs/components";

import { BtnFunction, StyledFunctions, StyledEmailContent } from "./styles";

import { useTranslation } from "react-i18next";

import Parser from "html-react-parser";

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

   useEffect(() => {
      if (!dataSettings) return;

      const dataSource = dataSettings.filter((item) => item);
      setDataSource(dataSource);
   }, [dataSettings]);

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
         title: "Tên",
         dataIndex: "name",
         sorter: true,
         width: "35%",
      },
      {
         title: "Nội dung",
         dataIndex: "value",
         sorter: true,
         render: (item: string) => {
            return item ? <TextEllipsis data={item.replace(/<[^>]*>?/gm, "")} length={100} /> : "-";
         },
         width: "65%",
      },
      {
         title: "Chức năng",
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
            totalPages={1}
            totalElements={dataSettings?.length || 0}
            loading={isLoadTemplates || isFetchTemplates}
         />
         <Modal
            type="confirm"
            visible={openDelete}
            onCancel={toggleOpenDelete}
            confirmIcon="?"
            title={"Bạn có chắc chắn muốn xóa email này không ?"}
         >
            <DeleteEmail handleClose={toggleOpenDelete} id={selectedWorkFlowId} />
         </Modal>
      </StyledEmailContent>
   );
};

export default EmailContent;
