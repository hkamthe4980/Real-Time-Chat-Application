import React from 'react'
import useStreamResponse from "../hooks/useStreamHook.js";
function TokenData({ tokenData }) {
  
    console.log("token data" , tokenData)
  return (
    <div>
         {tokenData?.usage ? (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-700">Token Details</h2>

            <ul className="space-y-2 text-gray-700">
              <li>🔹 <b>Input Tokens:</b> {tokenData.usage.inputTokens}</li>
              <li>🔹 <b>Output Tokens:</b> {tokenData.usage.outputTokens}</li>
              <li>🔹 <b>Total Tokens:</b> {tokenData.usage.totalTokens}</li>
              <li>🔹 <b>Generation Time:</b> {tokenData.usage.generationTime}s</li>
              <li>🔹 <b>Remaining Tokens:</b> {tokenData.usage.remainingTokens}</li>
              <li>🔹 <b>Usage Percent:</b> {tokenData.usage.usagePercent}%</li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-20">No token data yet</p>
        )}
    </div>
  )
}

export default TokenData
