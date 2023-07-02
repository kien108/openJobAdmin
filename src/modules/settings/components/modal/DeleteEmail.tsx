import React, { FC } from "react";

import { Button, openNotification } from "../../../../libs/components";

import { GroupButton, StyledDeleteEmail } from "./styles";

import { useTranslation } from "react-i18next";
import { useDeleteMutation } from "../../services";

// import { useDeleteTemplateMutation } from '../../services/AccountApp';

interface IDeleteEmail {
   handleClose: () => void;
   id: string | undefined;
}

const DeleteEmail: FC<IDeleteEmail> = ({ handleClose, id }) => {
   const { t } = useTranslation();

   const [deleteSetting, { isLoading: loadingDelete }] = useDeleteMutation();

   const handleConfirmDelete = () => {
      id &&
         deleteSetting(id)
            .unwrap()
            .then(() => {
               openNotification({
                  type: "success",
                  message: t("Delete this email successfully"),
               });

               handleClose();
            })
            .catch((error) => {
               openNotification({
                  type: "error",
                  message: t("Email already in use and can't be deleted"),
               });
               handleClose();
            });
   };

   return (
      <StyledDeleteEmail>
         <GroupButton>
            <Button height={44} key="submit" loading={loadingDelete} onClick={handleConfirmDelete}>
               Đồng ý
            </Button>
            <Button height={44} key="back" border="outline" onClick={handleClose}>
               Từ chối
            </Button>
         </GroupButton>
      </StyledDeleteEmail>
   );
};

export default DeleteEmail;
