import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Settings from './pages/Settings';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex">
        <ConditionalSidebar />
        <div className="flex-grow">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<AcceptInvitationPage />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

const ConditionalSidebar = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (path === '/' || path === '/settings') {
    return <Sidebar />;
  }

  return null;
};

export default App;
