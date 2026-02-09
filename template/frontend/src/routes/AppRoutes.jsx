import React from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from '../components/Layout.jsx';
import Home from "../pages/Home.jsx";
import Scan from "../pages/Scan.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* scroll to top when route changes */}
      {/* <ScrollToTop/>    */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
