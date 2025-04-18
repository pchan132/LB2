import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {Routes, Route } from "react-router-dom";
import axios from "axios";

import Nav from "./components/Nav";
import ManageMaills from "./pages/ManageMaills";
import ManageName from "./pages/ManageName";
import Home from "./pages/Home";
import Login from "./pages/Login";
function App() {
  return (
    <>
      <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage-maills" element={<ManageMaills />} />
          <Route path="/manage-name" element={<ManageName />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </>
  );
}

export default App;
