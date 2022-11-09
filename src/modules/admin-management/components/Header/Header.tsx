import React, { FC } from "react";

import { Title, PlusIcon, Button } from "../../../../libs/components";
import { StyledHeader } from "./styles";

import { useTranslation } from "react-i18next";

interface HeaderProps {
   isCreate: boolean;
   handleOpenCreate?: React.Dispatch<any>;
}

const Header: FC<HeaderProps> = ({ handleOpenCreate, isCreate }) => {
   const { t } = useTranslation();

   return (
      <StyledHeader>
         <Title>{t("adminManagement.title")}</Title>
         {isCreate && (
            <Button height={44} icon={<PlusIcon />} onClick={handleOpenCreate}>
               {t("adminManagement.create")}
            </Button>
         )}
      </StyledHeader>
   );
};

export default Header;
