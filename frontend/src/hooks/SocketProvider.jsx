import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const SocketContext = createContext(null);
export const useWebSocket = () => {
    return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
    const [webSocket, setWebSocket] = useState({});
    useEffect(() => {
        const port = 3030;
        const socket = io(`http://localhost:${port}`);
        setWebSocket(socket);
        console.log("You connected with the id of :", socket.id);
    }, [])
    return (

        <SocketContext.Provider value={{ webSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
