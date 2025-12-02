"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";

//? create global notification context container 
const NotificationContext = createContext();

//? provider component - holds the actual data
export const NotificationProvider = ({ children }) => {
    //? notifications array
    const [notifications, setNotifications] = useState([]);
    //? noitficatoin unread count for badge icon count
    const [unreadCount, setUnreadCount] = useState(0);
    //? latest notification
    const [latestNotification, setLatestNotification] = useState(null);

    //? pop notification
    const { enqueueSnackbar } = useSnackbar();

    //* when app loads check the localStorage for notifications & restore em'
    useEffect(() => {
        //? saved JSON string cos localStorage only stores strings
        const saved = localStorage.getItem("notifications");

        if (saved) {
            //? parse JSON string back to JS array
            const notiArr = JSON.parse(saved);
            console.log("Parsed notifications:", notiArr);

            //? set notifications(restore notifications) & unread count
            setNotifications(notiArr);

            //? count unread notifications
            let unreadCount = 0;
            for (const noti of notiArr) {
                if (noti.read === false) {
                    unreadCount++;
                }
            }
            setUnreadCount(unreadCount);
            console.log("Unread notification count:", unreadCount);
        }
    }, []);

    //* when `notifications` state changes, save to localStorage
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    //* SSE Connection - hits the API endpoint & gets the notifications
    useEffect(() => {
        //? auth - check if token exists
        const token = localStorage.getItem("token");
        if (!token) return;

        //? create a SSE connection w/ the auth token
        const eventSource = new EventSource(
            `http://localhost:5001/api/sse/notifications?token=${token}`
        );

        //? handle incoming messages - fires on every new event
        eventSource.onmessage = (event) => {
            console.log("Got a message from server!", event.data);

            try {
                //? parse to JSON
                const data = JSON.parse(event.data);
                console.log("Parsed data:", data);

                //? check notification type & create ourn own notification obj for the frontend
                if (data.type === "TAG_NOTIFICATION") {
                    const newNotif = {
                        id: Date.now(), // simple ID
                        ...data.payload,
                        read: false,
                        timestamp: new Date().toISOString(),
                    };

                    //? update states
                    setNotifications((prev) => [newNotif, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                    setLatestNotification(newNotif);

                    //? notificatiion store msg
                    // let msg = `${newNotif.groupName} \n Mentioned you \n ${newNotif.senderName}: "${newNotif.text}"`;
                    // ? pop-up notification msg
                    let popUpMsg = `${newNotif.senderName} Mentioned you \n : "${newNotif.text}"`;
                    enqueueSnackbar(popUpMsg, {
                        variant: 'default',
                        autoHideDuration: 3000,
                        style: { borderRadius: '26px' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' }
                    });
                }
            } catch (err) {
                console.error("❌ Error parsing notification:", err);
            }
        };

        //? handle SSE errors
        eventSource.onerror = (err) => {
            console.error("❌ Notification SSE Error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [enqueueSnackbar]);


    //* Utility Functions
    const markAsRead = (id) => {
        setNotifications((prev) =>
            //? if notification id matches 
            //? then copy all the old stuff(using spread operator), 
            //? update the read status 
            //? and return the updated notification object
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        //? decrement unread count
        let newUnreadCount = unreadCount - 1;
        setUnreadCount(newUnreadCount);
    };

    const markAllAsRead = () => {
        //? update all notifications to read
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        //? reset unread count
        setUnreadCount(0);
    };

    //? reset notifications & unread count state
    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                latestNotification,
                markAsRead,
                markAllAsRead,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};


//? custom hook to use context
export const useNotifications = () => {
    return useContext(NotificationContext)
};
