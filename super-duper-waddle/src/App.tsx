import { Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/dashboard";

function App() {
  return (
    <Routes>
      <Route element={<Dashboard />} path="/" />
      <Route element={<Dashboard />} path="*" />
    </Routes>
  );
}

export default App;
