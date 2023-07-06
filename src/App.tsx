import { PrivateRoute, i18n } from "./libs/common";

import { Layout, Common as CommonPage } from "./libs/components";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ModulesAuth } from "./modules/auth/src";
import { I18nextProvider } from "react-i18next";
import ModulesAdmin from "./modules/admin-management/modules-admin";
import ModulesCompany from "./modules/company/modules-company";
import ModulesWebUsers from "./modules/web-users/modules-web-users";
import ModulesSettings from "./modules/settings/modules-settings";
import ModulesJobs from "./modules/jobs/modules-jobs";
import ModulesJobsManagement from "./modules/jobs-management/modules-jobs-management";
import ModulesBusiness from "./modules/business/modules-business";
import ModulesInvoice from "./modules/invoice/modules-invoice";

import "./style.scss";
import "antd/dist/antd.css";
import ModulesAnalytics from "./modules/analytics/modules-analytics";

export function App() {
   return (
      <BrowserRouter>
         <I18nextProvider i18n={i18n}>
            <Routes>
               <Route element={<PrivateRoute />}>
                  <Route path="/*" element={<Layout />}>
                     <Route index element={<Navigate to="admin" />} />

                     <Route path="admin/*" element={<ModulesAdmin />} />
                     <Route path="company/*" element={<ModulesCompany />} />
                     <Route path="candidates/*" element={<ModulesWebUsers />} />
                     <Route path="settings/*" element={<ModulesSettings />} />
                     <Route path="jobs/*" element={<ModulesJobs />} />
                     <Route path="posts-management/*" element={<ModulesJobsManagement />} />
                     <Route path="business/*" element={<ModulesBusiness />} />
                     <Route path="invoice/*" element={<ModulesInvoice />} />
                     <Route path="analytics/*" element={<ModulesAnalytics />} />
                  </Route>
               </Route>
               <Route path="login" element={<ModulesAuth />} />
            </Routes>
         </I18nextProvider>
      </BrowserRouter>
   );
}

export default App;
