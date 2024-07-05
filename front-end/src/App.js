import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Stack } from 'react-bootstrap';
import Navbar from './Navbar';
import RegisterPatient from './Patient/RegisterPatient';
import RegisterClinic from './Clinic/RegisterClinic';
import LoginForm from './LoginForm';
import ClinicDashboard from './Clinic/ClinicDashboard';
import CreateDoctor from './Clinic/CreateDoctor';
import DoctorList from './Clinic/DoctorList';
import EditDoctor from './Clinic/EditDoctor';
import ClinicProfile from './Clinic/ClinicProfile';
import PatientDashboard from './Patient/PatientDashboard';
import Homepage from './Homepage';
import Footer from './Footer';
import ResetPassword from './ResetPasswordComponent';
import SearchList from './Search';
import UserProfileCard from './DoctorProfileView';
import UnauthorizedPage from './UnauthorizedPage';
import ProfileSettings from './Patient/PatientProfileSettings';
import AppointmentSlotList from './Clinic/AppointmentSlotList';
import AppointmentSlotCreate from './Clinic/AppointmentSlotCreate';
import AppointmentSlotCreateByWeeks from './Clinic/AppointmentSlotCreateByWeeks';
import BookAppointment from './Patient/BookAppointment';
import AppointmentSlotListForPatient from './Clinic/AppointmentSlotListForPatient';
import BookAppointmentRequests from './Doctor/BookAppointmentRequests';
import MyPatientAppointments from './Patient/MyPatientAppointments';
import MySchedule from './Doctor/MySchedule';
import ChatApp from './Chat/ChatComponent';
import useSignalRHub from './SiganlR/SignalRComponent';
import UserList from './ConnectionList';
import FriendList from './FirendsList';
import ProfilePage from './Patient/PatientProfile';
import NotificationService from './SiganlR/NotificationSender';
import AdminDashboard from './Adminn/AdminDashboard';
import Appointments from './Adminn/Appointments';
import DoctorDashboard from './Doctor/DoctorDashboard';
import { createBrowserHistory } from 'history';
import Clinics from './Adminn/Clinics';
import ClinicDetails from './Adminn/ClinicDetails';
import Patients from './Adminn/Patients';
import Doctors from './Adminn/Doctors';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const signalRHub = useSignalRHub('https://localhost:7207/chathub');
  const history = createBrowserHistory();

  const handleLogin = (role, token, userId) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setToken(token);
    setUserId(userId);
    const userData = { isLoggedIn: true, userRole: role, token, userId };
    sessionStorage.setItem('userData', JSON.stringify(userData));

    if(role === 'Patient'){
    history.push('/patient-dashboard');
    window.location.reload();
    }else if(role === 'Clinic'){
      history.push('/clinic-dashboard');
    window.location.reload();
    }else if(role === 'Admin'){
      history.push('/admin-dashboard');
    window.location.reload();
    }else if(role === 'Doctor'){
      history.push('/doctor-dashboard');
    window.location.reload();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUserId('');
    sessionStorage.removeItem('userData');
    window.location.href = '/login';
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const { isLoggedIn, userRole, token, userId } = JSON.parse(storedUserData);
      setIsLoggedIn(isLoggedIn);
      setUserRole(userRole);
      setToken(token);
      setUserId(userId);
    }
  }, []);

  return (
    <Stack direction="vertical">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} signalR={signalRHub} />
      <Router>
        <Routes>
          {isLoggedIn ? (
            <>
              {userRole === "Clinic" && (
                <>
                  <Route path="/clinic-dashboard" element={<ClinicDashboard />} />
                  <Route path="/edit-doctor/:id" element={<EditDoctor />} />
                  <Route path="/clinic-profile" element={<ClinicProfile userId={userId} />} />
                  <Route path="/create-doctor" element={<CreateDoctor userId={userId} />} />
                  <Route path="/doctor-list" element={<DoctorList userId={userId} />} />
                  <Route path="/appointment-slot-list" element={<AppointmentSlotList userId={userId} />} />
                  <Route path="/appointment-slot-create" element={<AppointmentSlotCreate userId={userId} />} />
                  <Route path="/appointment-slot-create-by-weeks" element={<AppointmentSlotCreateByWeeks userId={userId} />} />
                </>
              )}
              {userRole === "Patient" && (
                <>
                  <Route path="/patient-dashboard" element={<PatientDashboard />} />
                  <Route path="/search-list" element={<SearchList />} />
                  <Route path="/appointment-slot-list" element={<AppointmentSlotList userId={userId} />} />
                  <Route path="/appointment-slot-list-for-patient/:doctorId" element={<AppointmentSlotListForPatient userId={userId} />} />
                  <Route path="/book-appointment/:doctorId" element={<BookAppointment userId={userId} />} />
                  <Route path="/my-patient-appointments" element={<MyPatientAppointments userId={userId} />} />
                  <Route path="/chat" element={<ChatApp signalrConnection={signalRHub} />} />
                  <Route path="/chat/:personId" element={<ChatApp signalrConnection={signalRHub} />} />
                  <Route path="/profile" element={<ProfileSettings patientId={userId} />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard/>} />
                </>
              )}
              {userRole === "Doctor" && (
                <>
                  <Route path="/book-appointment-requests" element={<BookAppointmentRequests userId={userId} />} />
                  <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
                  <Route path="/my-schedule" element={<MySchedule userId={userId} />} />
                  <Route path="/chat" element={<ChatApp signalrConnection={signalRHub} />} />
                  <Route path="/chat/:personId" element={<ChatApp signalrConnection={signalRHub} />} />
                </>
              )}
              {userRole === "Admin" && (
                <>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/clinics" element={<Clinics />} />
              <Route path="/clinic-details/:clinicId" element={<ClinicDetails />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/chat" element={<ChatApp  signalrConnection={signalRHub} /> } />
              <Route path="/chat/:personId" element={<ChatApp  signalrConnection={signalRHub}/>} />
              </>
              )}
              <Route path="/user-profile/:userId" element={<ProfilePage signalRHub={signalRHub} />} />
              <Route path="/profile-card/:userId" element={<UserProfileCard />} />
              <Route path="/user-list" element={<FriendList signalRHub={signalRHub} />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
              <Route path="/register-patient" element={<RegisterPatient />} />
              <Route path="/register-clinic" element={<RegisterClinic />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard/>} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/*" element={<UnauthorizedPage />} />
            </>
          )}
        </Routes>
      </Router>
      <div className="static-content" style={{ width: '100%', overflowX: 'hidden' }}>
        <Footer />
      </div>
    </Stack>
  );
};

export default App;
