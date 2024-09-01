import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const initialState = {
  id: "",            
  email: "",
  role: "",          
  firstName: "",
  middleName: "",    
  lastName: "",
  username: "",
  dob: "",           
  mobileNumber: "",  
};

const UserContext = createContext(initialState);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);

  const updateUser = (userData) => {
    setUser(userData);
  };


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");  
        if (token) {
          const response = await axios.get("http://localhost:5000/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);  
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
