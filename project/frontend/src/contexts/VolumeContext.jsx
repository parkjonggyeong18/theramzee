// src/contexts/VolumeContext.js
import React, { createContext, useContext, useState } from 'react';

const VolumeContext = createContext();

export const VolumeProvider = ({ children }) => {
  const [volume, setVolume] = useState(0.5); // 초기 볼륨 값 (0.0 ~ 1.0)

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};

export const useVolume = () => {
  return useContext(VolumeContext);
};