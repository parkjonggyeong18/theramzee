// services/openvidu.js
import axios from 'axios';
import { OpenVidu } from '@openvidu/browser';
import { useState, useEffect } from 'react';

export const createSession = async (sessionId) => {
 const response = await axios.post('/api/sessions', { sessionId });
 return response.data;
};

export const createToken = async (sessionId) => {
<<<<<<< HEAD
 const response = await axios.post('/api/sessions/' + sessionId + '/connections');
=======
 const response = await axios.post(`/api/sessions/${sessionId}/connections`);
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
 return response.data;
};

// const createSession = async (sessionId) => {
//   const response = await axios.post('/api/sessions', { sessionId });
//   return response.data;
// };

// const createToken = async (sessionId) => {
//   const response = await axios.post('/api/sessions/' + sessionId + '/connections');
//   return response.data;
// };