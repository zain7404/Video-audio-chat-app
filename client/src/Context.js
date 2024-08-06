import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:3001");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [users, setUsers] = useState([]);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal, callType }) => {
      setCall({
        isReceivingCall: true,
        from,
        name: callerName,
        signal,
        callType,
      });
    });

    socket.on("updateUserList", (users) => {
      setUsers(users);
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      if (call.callType === "video") {
        userVideo.current.srcObject = currentStream;
      } else {
        const audio = new Audio();
        audio.srcObject = currentStream;
        audio.play();
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id, callType = "video") => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
        callType,
      });
    });

    peer.on("stream", (currentStream) => {
      if (callType === "video") {
        userVideo.current.srcObject = currentStream;
      } else {
        const audio = new Audio();
        audio.srcObject = currentStream;
        audio.play();
        console.log("userVideo", userVideo.current);
        // userVideo.current.muted = true;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  const updateUserName = (name) => {
    setName(name);
    socket.emit("updateUserName", name);
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName: updateUserName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        users,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
