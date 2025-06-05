import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    on: (eventName: string, callback: (data: any) => void) => void;
    off: (eventName: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
    children: ReactNode;
    token: string | null;
    url?: string;
}

export const SocketProvider = ({ children, token, url = "http://localhost:5000" }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const socketInstance = io(url, {
            auth: { token },
            withCredentials: true,
        });

        // Eventos básicos
        socketInstance.on("connect", () => {
            console.log("Conectado");
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            console.log("Desconectado");
            setIsConnected(false);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("Error:", error.message);
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [token, url]);

    const on = (eventName: string, callback: (data: any) => void) => {
        if (socket) {
            socket.on(eventName, callback);
        }
    };

    const off = (eventName: string) => {
        if (socket) {
            socket.off(eventName);
        }
    };

    return <SocketContext.Provider value={{ socket, isConnected, on, off }}>{children}</SocketContext.Provider>;
};

// Hook para usar el socket
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket debe usarse dentro de SocketProvider");
    }
    return context;
};
