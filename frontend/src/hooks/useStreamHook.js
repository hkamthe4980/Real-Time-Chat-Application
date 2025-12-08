import { useState, useEffect, useRef } from "react";

export default function useStreamResponse() {
  const [data, setData] = useState("");
  const [tokenData, setTokenData] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrormsg] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  // const typeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ⭐ NEW — for thinking loader
  const [isThinking, setIsThinking] = useState(false);

  // ADDED FOR BUDGET HANDLING
  const [budgetData, setBudgetData] = useState(null);

  const [ttft, setTtft] = useState(null);
  const eventRef = useRef(null);

  const sendQuery = (prompt, conversationId) => {
    console.log("----------useStreamHook ConversationId---------", conversationId);
    if (!prompt.trim()) return;

    setData("");
    setLoading(true);
    setTtft(null);
    setBudgetData(null);

    // ⭐ FIX ADDED — Start thinking when user sends message
    setIsThinking(true);

    const token = localStorage.getItem("token");
    const start = Date.now();
    let gotFirstToken = false;

    const id = conversationId ?? "";

    const eventSource = new EventSource(
      `http://localhost:5001/api/chat/stream?prompt=${encodeURIComponent(
        prompt
      )}&conversationId=${id}&token=${token}`
    );

    eventRef.current = eventSource;

    eventSource.onmessage = async (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setLoading(false);
        return;
      }

      try {
        const json = JSON.parse(event.data);
        console.log("json data in useStreameHook", json);

        // BUDGET EVENT
        if (json.type === "budget_exhausted") {
          setBudgetData(json);
          setLoading(false);
          setIsThinking(false);
          eventSource.close();
          return;
        }

        // ERRORS
        if (json.error) {
          setErrormsg(json.error);

          // Handle specific error types
          if (json.type === "rate_limit") {
            // Queue for retry with exponential backoff
            const retryAfter = json.retryAfter || 5001;
            console.log(`Rate limited, queuing for retry in ${retryAfter}ms`);

            // Auto-retry logic (max 5 attempts)
            if (retryCount < 5) {
              setIsRetrying(true);
              setRetryCount(prev => prev + 1);
              setTimeout(() => {
                console.log(`Retry attempt ${retryCount + 1}`);
                setIsRetrying(false);
                sendQuery(prompt, conversationId);
              }, Math.min(retryAfter * Math.pow(2, retryCount), 32000));
              return;
            } else {
              setIsRetrying(false);
            }
          }

          if (json.type === "bad_request" || json.type === "auth_error") {
            // Don't retry for user errors or auth issues
            setLoading(false);
            setIsThinking(false);
            eventSource.close();
            return;
          }

          if (json.type === "service_error") {
            // Retry with exponential backoff for service errors
            const retryAfter = json.retryAfter || 5001;
            if (retryCount < 5) {
              setIsRetrying(true);
              setRetryCount(prev => prev + 1);
              setTimeout(() => {
                console.log(`Service error retry ${retryCount + 1}`);
                setIsRetrying(false);
                sendQuery(prompt, conversationId);
              }, Math.min(retryAfter * Math.pow(2, retryCount), 32000));
              return;
            } else {
              setIsRetrying(false);
            }
          }

          // Default error handling
          setLoading(false);
          setIsThinking(false);
          eventSource.close();
        } else if (json.usage) {
          console.log("---json data for token data-----", json.usage)
          setTokenData(json.usage);
          return;
        }

        const text = json.text;
        if (text) {
          // --- Streaming buffer/throttle logic ---
          if (!window._tokenStreamQueue) window._tokenStreamQueue = [];
          const tokens = text.split(/(\s+)/); // split by whitespace, keep spaces
          window._tokenStreamQueue.push(...tokens);

          // Only start streamer if not already running
          if (!window._tokenStreamActive) {
            window._tokenStreamActive = true;
            function flushTokenQueue() {
              if (window._tokenStreamQueue.length > 0) {
                const nextToken = window._tokenStreamQueue.shift();
                setData(prev => (prev || "") + nextToken);
                if (!gotFirstToken && nextToken.trim()) {
                  setTtft(Date.now() - start);
                  gotFirstToken = true;
                }
                setTimeout(flushTokenQueue, 33); // ~30 tokens/sec
              } else {
                window._tokenStreamActive = false;
              }
            }
            flushTokenQueue();
          }
        }

      } catch {
        setData((prev) => prev + event.data);
      }
    };

    eventSource.onerror = () => {
      console.error("Stream error");
      eventSource.close();
      setLoading(false);
      setIsThinking(false);
    };
  };

  useEffect(() => {
    return () => {
      if (eventRef.current) eventRef.current.close();
    };
  }, []);

  // Stop streaming function
  const stopStream = () => {
    if (eventRef.current) {
      eventRef.current.close();
      setLoading(false);
      setIsThinking(false);
    }
  };

  return {
    data,
    tokenData,
    loading,
    errorMsg,
    isRetrying,
    retryCount,
    isThinking,
    ttft,
    sendQuery,
    stopStream,
    budgetData,
    setBudgetData,
  }; // ⭐ RETURNED TO FRONTEND
}













// import { useState, useEffect, useRef } from "react";

// export default function useStreamResponse() {
//   const [data, setData] = useState("");
//   const [tokenData, setTokenData] = useState();
//   const [loading, setLoading] = useState(false);

//   // ⭐ NEW — for thinking loader
//   const [isThinking, setIsThinking] = useState(false);

//   const [ttft, setTtft] = useState(null);
//   const [budgetData, setBudgetData] = useState(null);
//   const eventRef = useRef(null);



//   // inside your hook:
//   const sendQuery = (prompt, conversationId) => {
//     console.log("----------conversation id -----" , conversationId)
//     if (!prompt || !prompt.trim()) return;

//     setData("");
//     setLoading(true);
//     setIsThinking(true);
//     setTtft(null);
//     setBudgetData(null);

//     const token = localStorage.getItem("token");

//     // safe URL builder
//     const params = new URLSearchParams();
//     params.set("prompt", prompt);
//     if (conversationId) params.set("conversationId", conversationId);
//     if (token) params.set("token", token);

//     const url = `http://localhost:5000/api/chat/stream?${params.toString()}`;
//     console.log("Opening SSE:", url);

//     const eventSource = new EventSource(url);
//     eventRef.current = eventSource;

//     eventSource.onopen = () => {
//       console.log("SSE open:", url);
//     };

//     eventSource.onmessage = (event) => {
//       if (event.data === "[DONE]") {
//         setLoading(false);
//         setIsThinking(false);
//         eventSource.close();
//         return;
//       }
//       try {
//         const json = JSON.parse(event.data);

//         if (json.type === "budget_exhausted") {
//           setBudgetData(json);
//           setLoading(false);
//           setIsThinking(false);
//           eventSource.close();
//           return;
//         }

//         if (json.usage) {
//           setTokenData(json);
//           return;
//         }

//         const text = json.text || "";
//         if (text) {
//           if (!gotFirstToken) {
//             setTtft(Date.now() - start);
//             gotFirstToken = true;
//           }
//           setIsThinking(false);
//           setData((prev) => prev + text);
//         }
//       } catch (err) {
//         // if parsing fails, append raw chunk
//         console.warn("SSE chunk non-json:", event.data);
//         setData((prev) => prev + event.data);
//       }
//     };

//     eventSource.onerror = (err) => {
//       console.error("SSE error event:", err);
//       console.log("EventSource readyState:", eventSource.readyState);
//       setLoading(false);
//       setIsThinking(false);
//       try { eventSource.close(); } catch (e) { }
//     };
//   };


//   useEffect(() => {
//     return () => eventRef.current?.close();
//   }, []);

//   return {
//     tokenData,
//     data,
//     loading,
//     isThinking,    // ⭐ RETURN IT
//     ttft,
//     sendQuery,
//     budgetData,
//     setBudgetData,
//   };
// }












