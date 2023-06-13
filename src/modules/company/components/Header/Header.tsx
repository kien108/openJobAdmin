import React, { FC } from "react";

import { Title, PlusIcon, Button } from "../../../../libs/components";
import { StyledHeader } from "./styles";

import { useTranslation } from "react-i18next";

interface HeaderProps {
   title: string;
   handleOpenCreate?: React.Dispatch<any>;
}

const Header: FC<HeaderProps> = ({ handleOpenCreate, title }) => {
   const { t } = useTranslation();

   return (
      <StyledHeader>
         <Title>{t(`${title}`)}</Title>
         {handleOpenCreate && (
            <Button height={44} icon={<PlusIcon />} onClick={handleOpenCreate}>
               {"Tạo mới công ty"}
            </Button>
         )}
      </StyledHeader>
   );
};

export default Header;
