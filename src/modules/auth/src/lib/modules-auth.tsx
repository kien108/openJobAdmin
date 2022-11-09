import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages";
import { store } from "./redux/store";

import i18n from "./i18n/config";
import { RootState, useCommonSelector } from "../../../../libs/common";

export function ModulesAuth() {
   const { lang } = useCommonSelector((state: RootState) => state.lang);

   useEffect(() => {
      i18n.changeLanguage(lang);
   }, [lang]);

   return (
      <Provider store={store}>
         <I18nextProvider i18n={i18n}>
            <Routes>
               <Route index element={<Login />} />
            </Routes>
         </I18nextProvider>
      </Provider>
   );
}

export default ModulesAuth;
