import React, { FC } from "react";

import { Title, PlusIcon, Button } from "../../../../libs/components";
import { StyledEmailHeader } from "./styles";

import { useTranslation } from "react-i18next";

interface EmailHeaderProps {
   handleOpenCreate?: React.Dispatch<any>;
}

const EmailHeader: FC<EmailHeaderProps> = ({ handleOpenCreate }) => {
   const { t } = useTranslation();

   return (
      <StyledEmailHeader>
         <Title>{t("Email templates")}</Title>
         <Button height={44} icon={<PlusIcon />} onClick={handleOpenCreate}>
            {t("Create Email")}
         </Button>
      </StyledEmailHeader>
   );
};

export default EmailHeader;
