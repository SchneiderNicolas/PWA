import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ProtectedRoute: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['accessToken']);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (cookies.accessToken !== undefined) {
        setLoading(false);
        setIsAllowed(true);
      }
      setLoading(false);
    }
    checkSubscription();
  }, [navigate, cookies]);

  return isLoading ? <></> : isAllowed ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
