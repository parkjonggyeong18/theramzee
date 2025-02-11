import React, { createContext, useContext, useState } from 'react';

const OpenViduContext = createContext();

export const OpenViduProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  return (
    <OpenViduContext.Provider value={{ session, setSession, publisher, setPublisher, subscribers, setSubscribers }}>
      {children}
    </OpenViduContext.Provider>
  );
};

export const useOpenVidu = () => useContext(OpenViduContext);
