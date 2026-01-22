import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import { validateToken } from "../api/auth";

export const useAuth = () => {
    const [loggedIn, setLoggedIn] = useState(false);
  
    const login = (token: string) => {
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 6 * 60 * 60 * 1000);
      Cookies.set('jwtToken', token, { expires: expirationDate});
      setLoggedIn(true);
    };
  
    const logout = useCallback(() => {
      Cookies.remove('jwtToken');
      setLoggedIn(false);
    }, []);

    useEffect(() => {
      const token = Cookies.get('jwtToken');
      if (token) {
        validateToken(token).then((isValid) => {
          if (isValid) {
            setLoggedIn(true);
          } else {
            logout();
          }
        });
      } else {
        logout();
      }
    }, [logout]);
  
    return { loggedIn, login, logout };
  };
  
