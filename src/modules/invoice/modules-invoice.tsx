import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { store } from "./redux/store";

import { Invoice } from "./pages";

export function ModulesInvoice() {
   return (
      <Provider store={store}>
         <Routes>
            <Route index element={<Invoice />} />
         </Routes>
      </Provider>
   );
}

export default ModulesInvoice;
