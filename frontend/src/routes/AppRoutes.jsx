import React from "react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Login from "../screens/Login.jsx";
import Register from "../screens/Register.jsx";
import Home from "../screens/Home.jsx";
import Project from "../screens/Project.jsx";
import UserAuth from "../auth/UserAuth.jsx";
import Layout from "../components/Layout.jsx";

const AppRoutes = ()=>{
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<Home/>}/>
                    {/* <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/> */}
                    <Route path="/project" element={<UserAuth><Project/></UserAuth>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;