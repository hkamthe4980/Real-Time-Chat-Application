// src/components/TokenPanel.jsx
"use client";
import React from "react";

export default function TokenPanel({ tokenData, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="w-80 bg-white shadow-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-indigo-700">Token Usage</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mt-4">
          {tokenData ? (
            <ul className="space-y-2 text-sm text-gray-700">
              <li><b>Input:</b> {tokenData.inputTokens}</li>
              <li><b>Output:</b> {tokenData.outputTokens}</li>
              <li><b>Total:</b> {tokenData.totalTokens}</li>
              <li><b>Generation:</b> {tokenData.generationTime}s</li>
              <li><b>Remaining:</b> {tokenData.remainingTokens}</li>
              <li><b>Usage %:</b> {tokenData.usagePercent}%</li>
            </ul>
          ) : (
            <p className="text-gray-400">No token data yet</p>
          )}
        </div>
      </div>

      <div className="flex-1 bg-black/40" onClick={onClose}></div>
    </div>
  );
}
