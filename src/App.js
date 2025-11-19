
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.scss';
import Header from './components/Header/Header';
import VideoCall from "./components/VideoCallPage/VideoCallPage";
import LoginPage from "./components/LogIn/Login";
import Home from "./components/Home/Home";
import CoursesPage from "./components/Courses/CoursesPage";
import Profile from "./components/Profile/Profile";
import SuccessPayment from "./components/Courses/SuccessPayment";
import Loading from "./components/Loading/Loading";
import AboutUs from "./components/About us/AboutUs";
import ContactUs from "./components/Contact us/ContactUs";
import Footer from "./components/Footer/Footer";
import PaymentFailedPage from "./components/Courses/CanceledPayment";
import PolicyPage from "./components/Footer/policy";
import ForgotPassword from "./components/LogIn/ForgotPassword";
import ResetPassword from "./components/LogIn/resetPassword";

function App() {
  return (
    <div className="page-container">
      <Router>
        <Header />
        <Loading />
         <main className="content">
        <Routes>
            <Route path="/" element={<Navigate replace to='/home' />} />
            <Route path="/home" element={<Home />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/videoCall/:courseId" element={<VideoCall />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/success" element={<SuccessPayment />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/payment_failed" element = {<PaymentFailedPage/>}/>
            <Route path="/policy" element={<PolicyPage/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password/:token" element={<ResetPassword/>}/>
            {/* other rotes  */}
        </Routes>
      
        </main>
        <Footer />
        {/* <Footer /> */}
      </Router>
    </div >
  );
}

export default App;