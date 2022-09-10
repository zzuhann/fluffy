import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/HomePage";
import VetClinic from "./pages/AlwaysOpenVetClinic/VetClinic";
import Pairing from "./pages/Dating/Dating";
import ProfileLoginRegister from "./pages/ProfileSetting/ProfileLoginRegister";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="clinic" element={<VetClinic />} />
        <Route path="dating" element={<Pairing />} />
        <Route path="profile" element={<ProfileLoginRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
