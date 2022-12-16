import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyledStatus, StyledText } from "./styles";

export interface IStatus {
   isActive?: boolean;
}

const Status: FC<IStatus> = ({ isActive }) => {
   const { t } = useTranslation();

   return (
      <StyledStatus isActive={isActive}>
         <StyledText>
            {isActive ? t("common:status.active") : t("common:status.inactive")}
         </StyledText>
      </StyledStatus>
   );
};

export default Status;
