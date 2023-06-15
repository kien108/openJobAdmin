import { Menu, MenuProps, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import { StyledSidebar, StyledImage, StyledLogo } from "./styles";
import ImageLogo from "../../../assets/img/logo.png";

import { RiAdminLine } from "react-icons/ri";
import { MdOutlinePostAdd, MdWorkOutline } from "react-icons/md";
import { AiOutlineUser, AiOutlineSetting, AiOutlineHome } from "react-icons/ai";
import { GiPowerLightning } from "react-icons/gi";
import { SiBitcoinsv } from "react-icons/si";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";

type MenuItem = Required<MenuProps>["items"][number];

const SideBar = () => {
   const { t } = useTranslation();
   const { pathname } = useLocation();
   const [selectedKey, setSelectedKey] = useState("/");
   const [openKey, setOpenKey] = useState<string[]>([]);

   const getItem = (
      isShow: boolean,
      label: string,
      path: string,
      key: React.Key,
      icon?: React.ReactNode,
      children?: MenuItem[],
      popupClassName?: string
   ): MenuItem => {
      return popupClassName
         ? {
              key,
              icon,
              children,
              label: (
                 <Tooltip title={label} placement="right">
                    <Link className="link-sidebar" to={path}>
                       {label}
                    </Link>
                 </Tooltip>
              ),
              popupClassName,
           }
         : ({
              key,
              icon,
              children,
              label: (
                 <Link className="link-sidebar" to={path}>
                    {label}
                 </Link>
              ),
           } as MenuItem);
   };

   const items: MenuItem[] = [
      // getItem(true, t("sidebar.overview"), "/overview", "overview", <AiOutlineHome />),
      getItem(
         // useRole([ROLE_ENUM.SUPER_ADMIN]),
         true,
         "Quản lý quản trị viên",
         "/admin",
         "admin",
         <RiAdminLine />
      ),
      getItem(true, "Quản lý công ty", "/company", "company", <MdWorkOutline />),
      getItem(true, "Quản lý người dùng", "/candidates", "candidates", <AiOutlineUser />),
      getItem(true, "Quản lý cấu hình", "/settings", "settings", <AiOutlineSetting />),
      getItem(true, "Quản lý kỹ năng", "#", "jobs", <GiPowerLightning size={21} />, [
         getItem(true, "Quản lý chuyên ngành", "/jobs/majors", "jobs/majors"),
         getItem(true, "Quản lý chuyên ngành hẹp", "/jobs/specializations", "jobs/specializations"),
         getItem(true, "Quản lý kỹ năng", "/jobs/skills/skills", "jobs/skills"),
      ]),
      getItem(
         true,
         "Quản lý tin đăng tuyển",
         "posts-management",
         "posts-management",
         <MdOutlinePostAdd />
      ),
      getItem(true, "Dịch vụ công ty", "business", "business", <SiBitcoinsv />),
   ];

   const onOpenChange = (items: string[]) => {
      setOpenKey(items);
   };

   useEffect(() => {
      const paths = pathname.split("/");

      if (pathname.includes("jobs")) {
         setSelectedKey(paths.slice(1, 3).join("/"));
         setOpenKey(["jobs"]);
      } else {
         setSelectedKey(paths[1]);
         setOpenKey([]);
      }
   }, [pathname]);

   useEffect(() => {
      if (openKey.length > 0) {
         setTimeout(() => {
            (
               document.querySelectorAll(".ant-menu-submenu-title")[0] as HTMLElement
            )?.scrollIntoView({
               behavior: "smooth",
            });
         }, 500);
      }
   }, [openKey]);

   // useEffect(() => {
   //    document.addEventListener("mousemove", function (e) {
   //       const ele = document.querySelectorAll(".custom-menu")[0] as HTMLElement;
   //       const distance = ele?.offsetLeft + ele?.offsetWidth - e.pageX;
   //       distance < 8 && distance > 0
   //          ? ele?.classList.add("more-width")
   //          : ele?.classList.remove("more-width");
   //    });
   // }, []);

   return (
      <StyledSidebar>
         <StyledLogo>
            <Link to="/">
               <StyledImage src={ImageLogo} />
            </Link>
         </StyledLogo>
         <Menu
            className="custom-menu"
            mode="inline"
            selectedKeys={[selectedKey]}
            openKeys={openKey}
            items={items}
            onOpenChange={onOpenChange}
            triggerSubMenuAction="click"
         />
      </StyledSidebar>
   );
};

export default SideBar;
