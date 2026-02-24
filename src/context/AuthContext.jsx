import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
const cookies = new Cookies();

const COOKIE_NAME = "hoop_token";
const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 2 * 60 * 60, // 2 hours in seconds
  sameSite: "lax",
  secure: window.location.protocol === "https:", // auto: true on Vercel, false on localhost
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const savedToken = cookies.get(COOKIE_NAME);
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          // Token still valid
          setToken(savedToken);
          setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        } else {
          // Expired — clean up
          cookies.remove(COOKIE_NAME, { path: "/" });
        }
      } catch {
        // Malformed token — clean up
        cookies.remove(COOKIE_NAME, { path: "/" });
      }
    }
    setLoading(false); 
  }, []);

  
  const login = (tokenFromServer) => {
    cookies.set(COOKIE_NAME, tokenFromServer, COOKIE_OPTIONS);
    const decoded = jwtDecode(tokenFromServer);
    setToken(tokenFromServer);
    setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
  };

  const logout = () => {
    cookies.remove(COOKIE_NAME, { path: "/" });
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
