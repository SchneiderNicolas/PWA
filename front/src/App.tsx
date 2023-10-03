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
import { DiscussionProvider } from './contexts/DiscussionContext';
import { useResponsive } from './hooks/useResponsive';
import Discussion from './components/discussion/Discussion';
import NewDiscussion from './components/discussion/new/NewDiscussion';

const App = () => {
  const { isMobile } = useResponsive();
  return (
    <BrowserRouter>
      <DiscussionProvider>
        <div className="flex">
          <ConditionalSidebar />
          <div className="flex-grow">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/register" element={<AcceptInvitationPage />} />
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route
                  path="/discussion/:discussionId"
                  element={isMobile ? <Discussion /> : <Home />}
                />
                <Route
                  path="/new"
                  element={isMobile ? <NewDiscussion /> : <Home />}
                />

                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </DiscussionProvider>
    </BrowserRouter>
  );
};

const ConditionalSidebar = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (
    path === '/' ||
    path.startsWith('/discussion/') ||
    path.startsWith('/new') ||
    path === '/settings'
  ) {
    return <Sidebar />;
  }

  return null;
};

export default App;
