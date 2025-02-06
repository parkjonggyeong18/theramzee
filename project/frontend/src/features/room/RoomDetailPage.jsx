// import React, { useEffect, useState } from 'react';
// import { OpenVidu } from 'openvidu-browser';

// const OpenViduRoom = ({ roomId }) => {
//   const [session, setSession] = useState(null);
//   const [publisher, setPublisher] = useState(null);
//   const [subscribers, setSubscribers] = useState([]);

//   useEffect(() => {
//     const OV = new OpenVidu();
//     const newSession = OV.initSession();

//     const nickname = sessionStorage.getItem('nickname');
//     const openViduToken = sessionStorage.getItem('openViduToken');


//     newSession.on('streamCreated', (event) => {
//       const subscriber = newSession.subscribe(event.stream, undefined);
//       setSubscribers((prev) => [...prev, subscriber]);
//     });

//     setSession(newSession);
//     return () => newSession.disconnect();
//   }, [roomId]);

//   return (
//     <div>
//       <h2>OpenVidu Room</h2>
//       <div id="video-container">
//         {publisher && <video autoPlay={true} ref={(ref) => ref && (ref.srcObject = publisher.stream.getMediaStream())} />}
//         {subscribers.map((sub, index) => (
//           <video key={index} autoPlay={true} ref={(ref) => ref && (ref.srcObject = sub.stream.getMediaStream())} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OpenViduRoom;