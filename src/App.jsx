import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute, UserRoute } from "@/routes/authRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import HomeLayout from "@/layouts/HomeLayout";
import Home from "./pages/Home";
import Login from "@/pages/users/Login";
import SignUp from "@/pages/users/SignUp";
import Otp from "@/pages/users/Otp";
import ForgetPassword from "@pages/users/ForgetPassword"
import OtpResetPassword from "@pages/users/ForgetPassword/OtpResetPassword"

import DashBoard from "@/pages/clients/DashBoard";
import ContactList from "@/pages/clients/ContactList";
import Campaign from "@/pages/clients/Campaign";
import CampaignDetail from "@/pages/clients/Campaign/CampaignDetail";
import SendLog from "@/pages/clients/Campaign/SendLog";
// import SendLog from "../src/pages/clients/Campaign/SendLog.jsx"
import Settings from "@pages/Settings";
import Plan from "@/pages/clients/Plan";
import Template from "@/pages/clients/Template";
import TemplateDetail from "@/pages/clients/Template/TemplateDetail";
import Contact from "@/pages/clients/ContactList/Contact";
// admin
import DashBoardAdmin from "@/pages/admins/DashBoard";
import PackageAdmin from "@/pages/admins/Package";
import Transaction from "@/pages/admins/Transaction";
import User from "@/pages/admins/User";
import SendLogAdmin from "@/pages/admins/SendLog";

import Notification from "./pages/Notification";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/Payment/PaymentSuccess.jsx";
import PaymentFail from "./pages/Payment/PaymentFail.jsx";
import PaymentProcessing  from "./pages/Payment/payment-processing.jsx";


import { AuthProvider } from "./contexts/AuthContext.jsx";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* home */}
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          {/* payment */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-fail" element={<PaymentFail />} />
          <Route path="/payment-processing" element={<PaymentProcessing  />} />

          {/* login */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-otp" element={<Otp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<OtpResetPassword />} />


          {/*  */}
          <Route
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          >
            {/* admin */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashBoardAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/package"
              element={
                <AdminRoute>
                  <PackageAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/transaction"
              element={
                <AdminRoute>
                  <Transaction />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user"
              element={
                <AdminRoute>
                  <User />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/sendlog"
              element={
                <AdminRoute>
                  <SendLogAdmin />
                </AdminRoute>
              }
            />

            {/* client */}
            <Route
              path="/dashboard"
              element={
                <UserRoute>
                  <DashBoard />
                </UserRoute>
              }
            />
            <Route
              path="/campaign"
              element={
                <UserRoute>
                  <Campaign />
                </UserRoute>
              }
            />
            <Route
              path="/campaign/:id"
              element={
                <UserRoute>
                  <CampaignDetail />{" "}
                </UserRoute>
              }
            />
            <Route
              path="/campaign/:id/sendlog"
              element={
                <UserRoute>
                  <SendLog />
                </UserRoute>
              }
            />

            <Route
              path="/contact-list"
              element={
                <UserRoute>
                  <ContactList />
                </UserRoute>
              }
            />
            <Route
              path="/contact-list/:id"
              element={
                <UserRoute>
                  <Contact />{" "}
                </UserRoute>
              }
            />
            <Route
              path="/plan"
              element={
                <UserRoute>
                  <Plan />
                </UserRoute>
              }
            />
            <Route
              path="/template"
              element={
                <UserRoute>
                  <Template />
                </UserRoute>
              }
            />
            <Route
              path="/template/:id"
              element={
                <UserRoute>
                  <TemplateDetail />{" "}
                </UserRoute>
              }
            />

            <Route
              path="/notification"
              element={
                <UserRoute>
                  <Notification />{" "}
                </UserRoute>
              }
            />
            <Route
              path="/setting"
              element={
                <UserRoute>
                  <Settings />{" "}
                </UserRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
