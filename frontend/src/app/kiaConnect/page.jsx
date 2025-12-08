"use client";

import React from "react";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function KiaConnectPage() {
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        console.log("Kia Connect Login");
        setIsConnected(true);
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center p-6 bg-white">
            {!isConnected && (
                <button
                    onClick={handleConnect}
                    className="w-full max-w-sm bg-black text-white py-3 rounded-full shadow-md hover:bg-gray-700 transition"
                >
                    Connect
                </button>
            )}

            {isConnected && (
                <div className="w-full h-full">
                    {/* <div className="z-[9999] fixed top-10 right-5 pointer-events-none">
                        <button
                            type="button"
                            className="z-[9999] w-auto h-auto font-bold border-2 border-gray-300 bg-white text-black rounded-2xl shadow-md flex items-center justify-center"
                            onClick={() => {
                                console.log("false--------");
                                setIsConnected(false);
                            }}
                        >
                            <IoCloseSharp className="text-3xl m-2" />
                        </button>
                    </div> */}

                    <iframe
                        src="https://dms.kiaindia.net/cmm/cmmi/selectLoginMain.dms"
                        className="w-full h-full border-0"
                    />
                </div>
            )}
        </div>

    )
}