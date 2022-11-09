import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { store } from "./redux/store";

import i18n from "./i18n/config";
import { PermissionRoute, ROLE_ENUM, RootState, useCommonSelector } from "../../libs/common";
import { AdminManagement } from "./pages";

export function ModulesAdmin() {
   const { lang } = useCommonSelector((state: RootState) => state.lang);

   useEffect(() => {
      i18n.changeLanguage(lang);
   }, [lang]);

   return (
      <Provider store={store}>
         <I18nextProvider i18n={i18n}>
            <Routes>
               <Route
                  index
                  element={
                     <PermissionRoute
                        roles={[ROLE_ENUM.SUPER_ADMIN]}
                        component={<AdminManagement />}
                     />
                  }
               />
            </Routes>
         </I18nextProvider>
      </Provider>
   );
}

export default ModulesAdmin;
