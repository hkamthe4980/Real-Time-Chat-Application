
// // // import { useState } from "react";

// // // export default function useStreamResponse() {
// // //   const [data, setData] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [ttft, setTtft] = useState(null);

// // //   const sendQuery = async (prompt) => {
// // //     setLoading(true);
// // //     setData("");
// // //     setTtft(null);

// // //     const startTime = Date.now();
// // //     let firstTokenReceived = false;
// // //     const token = localStorage.getItem("token");

// // //     // const eventSource = new EventSource(`/api/chat/stream?prompt=${encodeURIComponent(prompt)}&token=${encodeURIComponent(token)}`)
// // //     const eventSource = new EventSource(`http://localhost:5000/api/chat/stream?prompt=${encodeURIComponent(prompt)}&token=${encodeURIComponent(token)}`);

// // //     // console.log("eventsource",eventSource.onmessage)


// // //     eventSource.onmessage = (event) => {
// // //       if (event.data === "[DONE]") {
// // //         eventSource.close();
// // //         setLoading(false);
// // //       } else {
// // //         try {
// // //           // console.log("event data", event.data)
// // //           const json = JSON.parse(event.data);
// // //           // console.log("json", json);

// // //           if (json.text.text) {
// // //             // console.log(" Received token:", json.text.text);
// // //             // ⏱ Calculate TTFT (first token time)
// // //             if (!firstTokenReceived) {
// // //               const timeTaken = Date.now() - startTime;
// // //               console.log(" TTFT:", timeTaken, "ms");
// // //               setTtft(timeTaken);
// // //               firstTokenReceived = true;
// // //             }
// // //             setData((prev) => prev + json.text.text);

// // //           }
// // //         } catch {
// // //           setData((prev) => prev + event.data);
// // //         }
// // //       }
// // //     };

// // //     eventSource.onerror = () => {
// // //       console.error(" Stream connection failed.");
// // //       eventSource.close();
// // //       setLoading(false);
// // //     };
// // //   };

// // //   return { data, loading, sendQuery, ttft };
// // // }











// // // // import { useState, useEffect, useRef } from "react";

// // // // export default function useStreamResponse() {
// // // //   const [data, setData] = useState("");
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [ttft, setTtft] = useState(null);
// // // //   const eventSourceRef = useRef(null);

// // // //   const sendQuery = async (prompt) => {
// // // //     if (!prompt.trim()) return;

// // // //     setLoading(true);
// // // //     setData("");
// // // //     setTtft(null);

// // // //     const token = localStorage.getItem("token");
// // // //     const startTime = Date.now();
// // // //     let firstTokenReceived = false;

// // // //     // ✅ Use backend directly to bypass Next.js rewrite buffer
// // // //     const eventSource = new EventSource(
// // // //       `http://localhost:5000/api/chat/stream?prompt=${encodeURIComponent(prompt)}&token=${encodeURIComponent(token)}`
// // // //     );

// // // //     eventSourceRef.current = eventSource;

// // // //     // ✅ Token buffer (for smoother incremental rendering)
// // // //     let buffer = "";
// // // //     let flushTimer = null;

// // // //     eventSource.onmessage = (event) => {
// // // //       if (event.data === "[DONE]") {
// // // //         clearTimeout(flushTimer);
// // // //         eventSource.close();
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const json = JSON.parse(event.data);
// // // //         console.log("🔹 Received chunk:", json);
// // // //         const tokenChunk = json?.text || json?.text?.text || ""; // handle nested format safely
// // // //         console.log("🔸 Token chunk:", tokenChunk);

// // // //         if (tokenChunk) {
// // // //           // ✅ Calculate TTFT once
// // // //           if (!firstTokenReceived) {
// // // //             const timeTaken = Date.now() - startTime;
// // // //             console.log("⚡ TTFT:", timeTaken, "ms");
// // // //             setTtft(timeTaken);
// // // //             firstTokenReceived = true;
// // // //           }

// // // //           // ✅ Buffer updates for smooth token flow (every 40ms)
// // // //           buffer += tokenChunk;
// // // //           if (!flushTimer) {
// // // //             flushTimer = setTimeout(() => {
// // // //               setData((prev) => prev + buffer);
// // // //               buffer = "";
// // // //               flushTimer = null;
// // // //             },10);
// // // //             // setData((prev)=>prev+buffer);
// // // //             // buffer="";
// // // //             // flushTimer=null;
// // // //           }
// // // //         }
// // // //       } catch (err) {
// // // //         console.warn("⚠️ Stream parse error:", err, event.data);
// // // //         setData((prev) => prev + event.data);
// // // //       }
// // // //     };

// // // //     eventSource.onerror = (err) => {
// // // //       console.error("❌ Stream connection failed:", err);
// // // //       eventSource.close();
// // // //       setLoading(false);
// // // //     };
// // // //   };

// // // //   // ✅ Auto-cleanup when unmounted
// // // //   useEffect(() => {
// // // //     return () => {
// // // //       if (eventSourceRef.current) eventSourceRef.current.close();
// // // //     };
// // // //   }, []);

// // // //   return { data, loading, sendQuery, ttft };
// // // // }








// // import { useState, useEffect, useRef } from "react";

// // export default function useStreamResponse() {
// //   const [data, setData] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [ttft, setTtft] = useState(null);
// //   const eventSourceRef = useRef(null);
// //   const flushTimerRef = useRef(null); // 👈 Added

// //   const sendQuery = async (prompt) => {
// //     if (!prompt.trim()) return;

// //     setLoading(true);
// //     setData("");
// //     setTtft(null);
// // // 
// //     const token = localStorage.getItem("token");
// //     const startTime = Date.now();
// //     let firstTokenReceived = false;
// //     let buffer = "";

// //     const eventSource = new EventSource(
// //       `http://localhost:5000/api/chat/stream?prompt=${encodeURIComponent(prompt)}&token=${encodeURIComponent(token)}`
// //     );
// //     eventSourceRef.current = eventSource;

// //     eventSource.onmessage = (event) => {
// //       if (event.data === "[DONE]") {
// //         clearTimeout(flushTimerRef.current);
// //         eventSource.close();
// //         setLoading(false);
// //         return;
// //       }

// //       try {
// //         const json = JSON.parse(event.data);
// //         const tokenChunk = json?.text || json?.text?.text || "";
// //         console.log("🔸 Token chunk:", tokenChunk);

// //         if (tokenChunk) {
// //           if (!firstTokenReceived) {
// //             const timeTaken = Date.now() - startTime;
// //             setTtft(timeTaken);
// //             firstTokenReceived = true;
// //           }

// //           buffer += tokenChunk;

// //           // if (!flushTimerRef.current) {
// //           //   flushTimerRef.current = setTimeout(() => {
// //           //     setData((prev) => prev + buffer);
// //           //     buffer = "";
// //           //     flushTimerRef.current = null;
// //           //   }, 35); // ✅ Balanced flush interval
// //           // }

// //         }
// //       } catch {
// //         setData((prev) => prev + event.data);
// //       }
// //     };

// //     eventSource.onerror = (err) => {
// //       console.error("❌ Stream connection failed:", err);
// //       eventSource.close();
// //       clearTimeout(flushTimerRef.current);
// //       setLoading(false);
// //     };
// //   };

// //   useEffect(() => {
// //     return () => {
// //       if (eventSourceRef.current) eventSourceRef.current.close();
// //       clearTimeout(flushTimerRef.current); // ✅ Proper cleanup
// //     };
// //   }, []);

// //   return { data, loading, sendQuery, ttft };
// // }


























// import { useState, useEffect, useRef } from "react";

// export default function useStreamResponse() {
//   const [data, setData] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [ttft, setTtft] = useState(null);
//   const eventSourceRef = useRef(null);
//   const flushTimerRef = useRef(null);

//   const sendQuery = async (prompt) => {
//     if (!prompt.trim()) return;

//     setLoading(true);
//     setData("");
//     setTtft(null);

//     const token = localStorage.getItem("token");
//     const startTime = Date.now();
//     let firstTokenReceived = false;
//     let buffer = "";

//     // ✅ Direct backend call for streaming (bypasses Next.js buffer)
//     const eventSource = new EventSource(
//       `http://localhost:5000/api/chat/stream?prompt=${encodeURIComponent(prompt)}&token=${encodeURIComponent(token)}`
//     );
//     eventSourceRef.current = eventSource;

//     eventSource.onmessage = (event) => {
//       if (event.data === "[DONE]") {
//         // 🧹 Clean up on completion
//         clearTimeout(flushTimerRef.current);
//         eventSource.close();
//         setLoading(false);
//         return;
//       }

//       try {
//         const json = JSON.parse(event.data);
//         const tokenChunk = json?.text || json?.text?.text || "";
//         if (!tokenChunk) return;

//         // ⏱ First token arrival
//         if (!firstTokenReceived) {
//           const timeTaken = Date.now() - startTime;
//           setTtft(timeTaken);
//           firstTokenReceived = true;
//         }

//         // 🧩 Collect tokens into buffer
//         buffer += tokenChunk;

//         // ✅ Flush buffered tokens every 35 ms
//         if (!flushTimerRef.current) {
//           flushTimerRef.current = setTimeout(() => {
//             setData((prev) => prev + buffer);
//             console.log("usestreameData", buffer)
//             buffer = "";
//             flushTimerRef.current = null;
//           }, 35);
//         }
//       } catch (err) {
//         console.warn("⚠️ Stream parse error:", err, event.data);
//       }
//     };

//     eventSource.onerror = (err) => {
//       console.error("❌ Stream connection failed:", err);
//       eventSource.close();
//       clearTimeout(flushTimerRef.current);
//       setLoading(false);
//     };
//   };
// console.log("useStreamResponse data", data);
//   // 🧹 Clean up when component unmounts
//   useEffect(() => {
//     return () => {
//       if (eventSourceRef.current) eventSourceRef.current.close();
//       clearTimeout(flushTimerRef.current);
//     };
//   }, []);

//   return { data, loading, sendQuery, ttft };
// }



import { useState, useEffect, useRef } from "react";

export default function useStreamResponse() {
  const [data, setData] = useState("");
  const [tokenData, setTokenData] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMsg , setErrormsg] = useState("")
  const [ttft, setTtft] = useState(null);
  const eventRef = useRef(null);


  console.log("error message" , errorMsg)

  const sendQuery = (prompt) => {
    if (!prompt.trim()) return;

    setData("");
    setLoading(true);
    setTtft(null);

    const token = localStorage.getItem("token");
    const start = Date.now();
    let gotFirstToken = false;

    // connect directly to backend (bypass Next.js)
    const eventSource = new EventSource(
      `http://localhost:5000/api/chat/stream?prompt=${encodeURIComponent(prompt)}&token=${token}`
    );
    eventRef.current = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setLoading(false);
        return;
      }

      try {

        const json = JSON.parse(event.data);
        console.log("json data in useStreameHook", json)
        // console.log("json data in useStreameHook text", json.text.text)
        // if (json.usage) {
        //   setTokenData(json);
        //   return;  // Stop processing text for this event
        // }
        if(json.error){
          setErrormsg(json.error)

        }
        else if(json.usage){
          setTokenData(json);
          return;  // Stop processing text for this event
          
        }


        const text = json.text || json?.text?.text || "";
        if (text) {
          if (!gotFirstToken) {
            setTtft(Date.now() - start);
            gotFirstToken = true;
          }
          setData((prev) => prev + text);
        }
      } catch {
        setData((prev) => prev + event.data);
      }
    };

    eventSource.onerror = () => {
      console.error("Stream error");
      eventSource.close();
      setLoading(false);
    };
  };

  // cleanup
  useEffect(() => {
    return () => {
      if (eventRef.current) eventRef.current.close();
    };
  }, []);

  return { tokenData, data, loading, sendQuery, ttft , errorMsg };
}
