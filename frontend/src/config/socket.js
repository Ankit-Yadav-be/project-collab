import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  console.log(projectId);
  socketInstance = socket(`http://localhost:8000`, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  return socketInstance;
};

export const recieveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  socketInstance.emit(eventName, data);
};
