// hooks/useOpenVidu.js
import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { OpenVidu } from '@openvidu/browser';
=======
import { OpenVidu } from 'openvidu-browser';
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
import { createSession } from '../services/openvidu';

export const useOpenVidu = (sessionId) => {
  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);

  useEffect(() => {
    const OV = new OpenVidu();
    const session = OV.initSession();
    setSession(session);

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, 'subscriber');
    });

    createSession(sessionId).then((token) => {
      session.connect(token)
        .then(() => {
          let publisher = OV.initPublisher('publisher');
          session.publish(publisher);
          setPublisher(publisher);
        });
    });
<<<<<<< HEAD
=======

    return () => {
      if (session) {
        session.disconnect();
      }
    };
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  }, [sessionId]);

  return { session, publisher };
};