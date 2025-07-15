import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages & Components
import Home from "./pages/Home";
import AuthWrapper from "./components/AuthWrapper";
import ContactUs from "./pages/ContactUs";
import PostJob from "./pages/PostJob";
import MyTask from "./pages/MyTask";
import Jobs from "./pages/Jobs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TaskDetail from "./pages/TaskDetail";
import EditTask from "./pages/EditTask";
import OTPVerification from "./components/OTPVerification";

// Settings Section
import SettingsPage from "./pages/SettingsPage"; // This should use <Outlet />
import ProfileUpdate from "./components/AccountSettings/ProfileUpdate";
import EmailUpdate from "./components/AccountSettings/EmailUpdate";
import PasswordChange from "./components/AccountSettings/PasswordChange";
import TaskerDashboard from "./pages/TaskerDashboard";
import MyOfferDetail from "./components/MyOfferDetail";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<AuthWrapper />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/postjob" element={<PostJob />} />
          <Route path="/mytask" element={<MyTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/edit-task/:id" element={<EditTask />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
           <Route path="/dashboard" element={<TaskerDashboard/>} />
           <Route path="/my-offers/:id" element={<MyOfferDetail/>} />

 
          {/* ✅ Nested settings routes */}
          <Route path="/settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileUpdate />} />
            <Route path="email" element={<EmailUpdate />} />
            <Route path="password" element={<PasswordChange />} />
           

          </Route>
        </Routes>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
