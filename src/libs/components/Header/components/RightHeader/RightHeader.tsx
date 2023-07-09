import React, { useState } from "react";
import { Typography } from "antd";
import { Notification } from "../Notification";
import { NavLink } from "react-router-dom";
import { AccountType, LanguageType } from "../../types";
import { useTranslation } from "react-i18next";
import { StyledRightHeader } from "./styles";
import "../Popover/style.scss";

import { Popover } from "../Popover";
import { useCommonDispatch, changeLang } from "../../../../common";
import { LanguageIcon, NotificationIcon } from "../../../Icons";
import { Image } from "../../../Avatar";
import logo from "../../../../../assets/img/hu.png";
const { Text } = Typography;

interface Props {
   languages: LanguageType[];
   accounts: AccountType[];
}

const RightHeader = ({ languages, accounts }: Props) => {
   const { t, i18n } = useTranslation();
   const dispatch = useCommonDispatch();

   const [visiblePopover, setVisiblePopover] = useState(false);

   const handleVisibleChange = (newVisible: boolean) => {
      setVisiblePopover(newVisible);
   };

   return (
      <StyledRightHeader>
         <div className="dropdown">
            <Popover
               overlayClassName="styled-header-popover"
               trigger="click"
               content={
                  <div className="dropdown-group-btn">
                     {accounts.map((account) => (
                        <NavLink key={account.id} to={account.path}>
                           <button
                              className="button-content"
                              onClick={() => setVisiblePopover(false)}
                           >
                              <Text>{t(account.title)}</Text>
                           </button>
                        </NavLink>
                     ))}
                  </div>
               }
            >
               <button className="button-header">
                  <Image type="circle" src={logo} width="40px" />
               </button>
            </Popover>
         </div>
      </StyledRightHeader>
   );
};

export default RightHeader;
