// services/openvidu.js
import axios from 'axios';
import { OpenVidu } from '@openvidu/browser';
import { useState, useEffect } from 'react';

export const createSession = async (sessionId) => {
 const response = await axios.post('/api/sessions', { sessionId });
 return response.data;
};

export const createToken = async (sessionId) => {
 const response = await axios.post('/api/sessions/' + sessionId + '/connections');
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