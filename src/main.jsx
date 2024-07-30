import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminCreateUser from './pages/AdminCreateUser/AdminCreateUser.jsx';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import AdminUpdateUser from './pages/AdminUpdateUser/AdminUpdateUser.jsx';
import GenerateKeyPage from './pages/GenerateKeyPage/GenerateKeyPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import LoginForm from './pages/LoginForm/LoginForm.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import FileUploadFile from './pages/UploadFiles/FileUploadFile.jsx';
import UserDashboard from './pages/UserDashboard/UserDashboard.jsx';
import UserAccountManagement from './pages/UserAccountManagement/UserAccountManagement.jsx';
import UserActivityBilling from './pages/UserActivityBilling/UserActivityBilling.jsx';
import UserPayment from './pages/UserPayment/UserPayment.jsx';
import AdminAccountManagement from './pages/AdminAccountManagement/AdminAccountManagement.jsx';
import AdminUserActivity from './pages/AdminUserActivity/AdminUserActivity.jsx';
import UserCloudServiceUpgrade from './pages/UserCloudServiceUpgrade/UserCloudServiceUpgrade.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard.jsx';
import SuperAdminUpdateAdmin from './pages/SuperAdminUpdateAdmin/SuperAdminUpdateAdmin.jsx';
import SuperAdminCreateAdmin from './pages/SuperAdminCreateAdmin/SuperAdminCreateAdmin.jsx';
import SuperAdminViewUser from './pages/SuperAdminViewUser/SuperAdminViewUser.jsx';
import SuperAdminCreateUser from './pages/SuperAdminCreateUser/SuperAdminCreateUser.jsx';
import SuperAdminUpdateUser from './pages/SuperAdminUpdateUser/SuperAdminUpdateUser.jsx';
import SuperAdminAdminActivity from './pages/SuperAdminAdminActivity/SuperAdminAdminActivity.jsx';
import SuperAdminUserActivity from './pages/SuperAdminUserActivity/SuperAdminUserActivity.jsx';
import SuperAdminAccountManagement from './pages/SuperAdminAccountManagement/SuperAdminAccountManagement.jsx';

// Set up Axios to include the token in the Authorization header for all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/generatekey" element={<GenerateKeyPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminupdateuser" element={<AdminUpdateUser />} />
        <Route path="/admincreateuser" element={<AdminCreateUser />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/upload" element={<FileUploadFile />} />
        <Route path="/useraccmanagement" element={<UserAccountManagement />} />
        <Route path="/useractivitybilling" element={<UserActivityBilling />} />
        <Route path="/userpayment" element={<UserPayment />} />
        <Route path="/adminaccmanagement" element={<AdminAccountManagement />} />
        <Route path="/adminuseractivity" element={<AdminUserActivity />} />
        <Route path="/usercloudserviceupgrade" element={<UserCloudServiceUpgrade />} />
        <Route path="/superadmindashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadminupdateadmin" element={<SuperAdminUpdateAdmin />} />
        <Route path="/superadmincreateadmin" element={<SuperAdminCreateAdmin />} />
        <Route path="/superadminviewuser" element={<SuperAdminViewUser />} />
        <Route path="/superadmincreateuser" element={<SuperAdminCreateUser />} />
        <Route path="/superadminupdateuser" element={<SuperAdminUpdateUser />} />
        <Route path="/superadminadminactivity" element={<SuperAdminAdminActivity />} />
        <Route path="/superadminuseractivity" element={<SuperAdminUserActivity />} />
        <Route path="/superadminaccmanagement" element={<SuperAdminAccountManagement />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);