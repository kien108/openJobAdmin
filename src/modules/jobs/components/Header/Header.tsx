import React, { FC } from "react";

import { Title, PlusIcon, Button } from "../../../../libs/components";
import { StyledHeader } from "./styles";

import { useTranslation } from "react-i18next";

interface HeaderProps {
   handleOpenCreate?: React.Dispatch<any>;
   title: string;
}

const Header: FC<HeaderProps> = ({ handleOpenCreate, title }) => {
   const { t } = useTranslation();

   return (
      <StyledHeader>
         <Title>{title}</Title>
         <Button height={44} icon={<PlusIcon />} onClick={handleOpenCreate}>
            Tạo mới
         </Button>
      </StyledHeader>
   );
};

export default Header;
