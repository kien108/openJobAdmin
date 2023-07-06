import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";

import { Analytics } from "./pages";
import { CVsChart, IncomeChart, JobsChart } from "./components";
import { UsersChart } from "./components/UsersChart";

export function ModulesAnalytics() {
   return (
      <Provider store={store}>
         <Routes>
            {/* <Route index element={<Navigate to={"/analytics/jobs"} />} /> */}
            <Route path="/*" element={<Analytics />}>
               <Route path="posts" element={<JobsChart />} />
               <Route path="cvs" element={<CVsChart />} />
               <Route path="users" element={<UsersChart />} />
               <Route path="income" element={<IncomeChart />} />
            </Route>
         </Routes>
      </Provider>
   );
}

export default ModulesAnalytics;
