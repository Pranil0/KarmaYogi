import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthWrapper from "./components/AuthWrapper";
import ContactUs from "./pages/ContactUs";
import PostJob from "./pages/PostJob";
import MyTask from "./pages/MyTask";

import Jobs from "./pages/Jobs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/auth" element={<AuthWrapper />} />          
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/postjob" element={<PostJob />} />
          <Route path="/mytask" element={<MyTask />} />


        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
