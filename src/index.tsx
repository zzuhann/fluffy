import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/HomePage";
import ProfileLoginRegister from "./pages/Profile/ProfileLoginRegister";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        {/* <Route path="products/:id" element={<Product />} />
        <Route path="hello" element={<Hello />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="thankyou" element={<ThankYou />} /> */}
        <Route path="profile" element={<ProfileLoginRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
