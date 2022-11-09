import { EmailHeader, EmailContent } from "../../components";
import { StyledModal } from "./styles";

import { useToggle } from "../../hooks";
import { useTranslation } from "react-i18next";

import { Modal } from "../../../../libs/components";
import { useState } from "react";
import { ISetting, ITemplateItem } from "../../types";
import { CreateAndEditEmail } from "../../components/modal";
import { useGetSettingsQuery } from "../../services";

const EmailTemplates = () => {
   const { t } = useTranslation();
   const [selectedEmail, setSelectedEmail] = useState<ISetting>();

   const handleSelectedEmail = (email: ISetting) => {
      setSelectedEmail(email);
   };

   const [isOpenCreate, toggleModal] = useToggle();

   const handleCloseCreateAndEdit = () => {
      setSelectedEmail(undefined);
      toggleModal();
   };

   return (
      <>
         <EmailHeader handleOpenCreate={handleCloseCreateAndEdit} />
         <EmailContent
            selectedEmail={handleSelectedEmail}
            handleOpenEdit={handleCloseCreateAndEdit}
         />

         <StyledModal
            title={selectedEmail ? t("Edit email") : t("Create email")}
            destroyOnClose={true}
            visible={isOpenCreate}
            onCancel={handleCloseCreateAndEdit}
         >
            <CreateAndEditEmail
               handleClose={handleCloseCreateAndEdit}
               selectedEmail={selectedEmail}
            />
         </StyledModal>
      </>
   );
};

export default EmailTemplates;
