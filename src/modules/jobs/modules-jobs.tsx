import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";

import i18n from "./i18n/config";
import { PermissionRoute, ROLE_ENUM, RootState, useCommonSelector } from "../../libs/common";
import { Major, Skills, Specialization } from "./pages";
import { SkillInvalidate } from "./pages/SkillActive";

export function ModulesJobs() {
   const { lang } = useCommonSelector((state: RootState) => state.lang);

   useEffect(() => {
      i18n.changeLanguage(lang);
   }, [lang]);

   return (
      <Provider store={store}>
         <I18nextProvider i18n={i18n}>
            <Routes>
               <Route index element={<Navigate to="majors" />} />
               <Route
                  path="majors"
                  element={
                     <PermissionRoute
                        roles={[ROLE_ENUM.SUPER_ADMIN, ROLE_ENUM.ADMIN]}
                        component={<Major />}
                     />
                  }
               />
               <Route
                  path="specializations"
                  element={
                     <PermissionRoute
                        roles={[ROLE_ENUM.SUPER_ADMIN, ROLE_ENUM.ADMIN]}
                        component={<Specialization />}
                     />
                  }
               ></Route>
               <Route path="specializations/:id" element={<Skills />} />
               <Route
                  path="skills-invalidate"
                  element={
                     <PermissionRoute
                        roles={[ROLE_ENUM.SUPER_ADMIN, ROLE_ENUM.ADMIN]}
                        component={<SkillInvalidate />}
                     />
                  }
               />
            </Routes>
         </I18nextProvider>
      </Provider>
   );
}

export default ModulesJobs;
