import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MultiFactorAuth from "./pages/MultiFactorAuth";
import { Toaster } from 'react-hot-toast';

import axios from "axios";
import { AppProvider } from "./AppProvider";
import { Navigate } from "react-router-dom"
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;


function App() {
  const accessToken = window.sessionStorage.getItem('access_token');
  const user = JSON.parse(window.sessionStorage.getItem('user'));
  const isAauthenticated = accessToken !== null && user !== null;
  return (
    <>
      <Toaster
        toastOptions={{ duration: 5000 }} />

      <CssBaseline />
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          {isAauthenticated ?
            <>
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify" element={<MultiFactorAuth />} />
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
            </> : Navigate("/login")}
        </Routes>
      </AppProvider>
    </>
  );
}

export default App;
