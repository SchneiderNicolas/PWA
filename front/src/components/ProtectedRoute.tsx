import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ProtectedRoute: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['authToken']);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (cookies.authToken !== undefined) {
        setLoading(false);
        setIsAllowed(true);
      }
      setLoading(false);
      /*
      const config = {
        headers: { Authorization: `Bearer ${cookies.Bestofy_Token}` },
      };
      return await axios
        .get(URL_USER_SUBSCRIPTION, config)
        .then(function (response) {
          setIsAllowed(response.data.subscription.active);
          localStorage.setItem(
            "Bestofy_Subscribed",
            response.data.subscription.active,
          );
          setLoading(false);
        })
        .catch(function (error) {
          error.code === "ERR_BAD_REQUEST"
            ? setLoading(false)
            : navigate("/error");
        });
            */
    }
    checkSubscription();
  }, [navigate, cookies]);

  return isLoading ? <></> : isAllowed ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
