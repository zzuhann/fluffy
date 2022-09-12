import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/HomePage";
import VetClinic from "./pages/AlwaysOpenVetClinic/VetClinic";
import Pairing from "./pages/Dating/Dating";
import ProfileLoginRegister from "./pages/ProfileSetting/ProfileLoginRegister";
import AllArticles from "./pages/Articles/AllArticles";
import ArticleDetail from "./pages/Articles/ArticleDetail";
import AllPetDiaries from "./pages/PetDiaries/AllPetDiraies";
import DiaryDetail from "./pages/PetDiaries/DiaryDetail";
import UserProfile from "./pages/UserProfile/UserProfile";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="clinic" element={<VetClinic />} />
        <Route path="articles" element={<AllArticles />} />
        <Route path="articles/:id" element={<ArticleDetail />} />
        <Route path="petdiary" element={<AllPetDiaries />} />
        <Route path="petdiary/:id" element={<DiaryDetail />} />
        <Route path="dating" element={<Pairing />} />
        <Route path="profile/:id" element={<UserProfile />} />
        <Route path="profile" element={<ProfileLoginRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
