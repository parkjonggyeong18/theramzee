// // hooks/useOpenVidu.js
// import { useState, useEffect } from 'react';
// import { OpenVidu } from '@openvidu/browser';
// import { createSession } from '../services/openvidu';

// export const useOpenVidu = (sessionId) => {
//   const [session, setSession] = useState(undefined);
//   const [publisher, setPublisher] = useState(undefined);

//   useEffect(() => {
//     const OV = new OpenVidu();
//     const session = OV.initSession();
//     setSession(session);

//     session.on('streamCreated', (event) => {
//       const subscriber = session.subscribe(event.stream, 'subscriber');
//     });

//     createSession(sessionId).then((token) => {
//       session.connect(token)
//         .then(() => {
//           let publisher = OV.initPublisher('publisher');
//           session.publish(publisher);
//           setPublisher(publisher);
//         });
//     });
//   }, [sessionId]);

//   return { session, publisher };
// };