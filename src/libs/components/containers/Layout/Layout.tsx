import { Sidebar } from "../../Sidebar";
import {
   getToken,
   RootState,
   useCommonDispatch,
   useCommonSelector,
   useGetAdminByIdQuery,
   changeSidebar,
} from "../../../common";
import { Layout as AntLayout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./styles.scss";
import { decodeToken } from "react-jwt";
import { saveUser } from "../../../common";
import { Header } from "../../Header";

import { Scrollbars } from "react-custom-scrollbars-2";

const { Content, Sider } = AntLayout;

interface IToken {
   id: string;
}

const Layout = () => {
   const dispatch = useCommonDispatch();
   const { id } = useCommonSelector((state: RootState) => state.user.user);
   const navigate = useNavigate();
   const { data, isLoading } = useGetAdminByIdQuery(id, { skip: !id });
   const accessToken = getToken();
   const { isOpen } = useCommonSelector((state: RootState) => state.sidebarSlice);

   useEffect(() => {
      if (!data) return;

      dispatch(saveUser(data));
   }, [data]);

   useEffect(() => {
      document.addEventListener("mousemove", function (e) {
         const ele = document.querySelectorAll(".site-layout-content")[0] as HTMLElement;
         const distance = ele?.offsetLeft + ele?.offsetWidth - e.pageX;
         const distance02 = ele?.offsetTop + ele?.offsetHeight - e.pageY;

         (distance < 8 && distance > 0) || (distance02 < 8 && distance02 > 0)
            ? ele?.classList.add("more-width")
            : ele?.classList.remove("more-width");
      });
   }, []);

   // useEffect(() => {
   //    !accessToken && navigate("/login");
   // }, [accessToken]);
   return (
      <AntLayout hasSider>
         <Sider
            width={272}
            theme="light"
            className="custom-sidebar"
            style={{
               height: "100vh",
               position: "sticky",
               left: 0,
               top: 0,
               bottom: 0,
               transition: "all 0.3s",
               zIndex: 999,
            }}
            collapsible
            collapsed={isOpen}
            onCollapse={() => {
               dispatch(changeSidebar());
            }}
            breakpoint="xl"
            collapsedWidth="80"
         >
            <Sidebar />
         </Sider>
         <AntLayout style={{ height: "100vh", background: "rgb(250 250 251)" }}>
            <Header />
            <Scrollbars
               id="scroll-main"
               renderTrackVertical={(props) => (
                  <div {...props} className="track-vertical" id="track-vertical-main" />
               )}
               renderThumbVertical={(props) => <div {...props} className="thumb-vertical" />}
            >
               <Content
                  className="site-layout-content"
                  style={{ padding: 24, background: "rgb(250 250 251)" }}
               >
                  <Outlet />
               </Content>
            </Scrollbars>
         </AntLayout>
      </AntLayout>
   );
};

export default Layout;
