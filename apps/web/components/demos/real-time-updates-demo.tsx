"use client";

import { useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Button, Card, Badge, Input } from "rsc-daisyui";
import {
  FaArrowsRotate,
  FaPlay,
  FaPause,
  FaBolt,
  FaSpinner,
  FaPaperPlane,
  FaClock,
  FaMessage,
} from "react-icons/fa6";
import { fetcher } from "../../utils/fetcher";
import { LiveData, Message } from "../../types/api";

export function RealTimeUpdatesDemo() {
  const [isPolling, setIsPolling] = useState(false);
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);
  const { mutate } = useSWRConfig();

  // リアルタイムデータ (自動更新)
  const {
    data: liveData,
    error: liveError,
    isLoading: liveLoading,
  } = useSWR<LiveData>("/api/live-data", fetcher, {
    refreshInterval: isPolling ? 2000 : 0, // 2秒ごとに更新
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  // チャットメッセージ
  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
    mutate: mutateMessages,
  } = useSWR<Message[]>("/api/messages", fetcher, {
    refreshInterval: 3000, // 3秒ごとに更新
  });

  // Function to display notifications
  const addNotification = (text: string) => {
    setNotifications((prev) => [...prev.slice(-4), text]); // Keep latest 5 items
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
  };

  // Monitor real-time data changes
  useEffect(() => {
    if (liveData && isPolling) {
      addNotification(`Live data updated: ${new Date().toLocaleTimeString()}`);
    }
  }, [liveData, isPolling]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (response.ok) {
        setMessage("");
        // Update cache immediately
        mutateMessages();
        addNotification("Message sent successfully");
      }
    } catch {
      addNotification("Failed to send message");
    }
  };

  const handleManualRefresh = () => {
    mutate((key) => typeof key === "string" && key.startsWith("/api/"));
    addNotification("All data manually refreshed");
  };

  const togglePolling = () => {
    setIsPolling(!isPolling);
    addNotification(
      isPolling ? "Auto-refresh stopped" : "Auto-refresh started"
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Real-time Updates Demo</h3>
        <p className="text-base-content/70">
          Experience SWR&apos;s automatic refresh features and real-time data
          synchronization
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <h4 className="card-title flex items-center gap-2 text-lg">
            <FaBolt className="w-5 h-5 text-warning" />
            Controls
          </h4>

          <div className="flex flex-wrap gap-3">
            <Button
              color={isPolling ? "error" : "success"}
              onClick={togglePolling}
              className="gap-2"
            >
              {isPolling ? <FaPause /> : <FaPlay />}
              {isPolling ? "Stop Auto-refresh" : "Start Auto-refresh"}
            </Button>

            <Button
              color="primary"
              onClick={handleManualRefresh}
              className="gap-2"
            >
              <FaArrowsRotate />
              Manual Refresh
            </Button>

            <Badge color={isPolling ? "success" : "error"} size="lg">
              {isPolling ? "Real-time Updates Active" : "Updates Stopped"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge color="info" size="sm">
              SWR Key: /api/live-data (refreshInterval:{" "}
              {isPolling ? "2000ms" : "0ms"})
            </Badge>
            <Badge color="warning" size="sm">
              SWR Key: /api/messages (refreshInterval: 3000ms)
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Data */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaClock className="w-5 h-5 text-info" />
              Live Data
              {liveLoading && <FaSpinner className="animate-spin w-4 h-4" />}
            </h4>

            {liveError && (
              <div className="alert alert-error">
                <span>Error: {liveError.message}</span>
              </div>
            )}

            {liveData && !Array.isArray(liveData) && (
              <div className="space-y-4">
                <div className="stats stats-vertical shadow w-full">
                  <div className="stat">
                    <div className="stat-title">Current Time</div>
                    <div className="stat-value text-primary text-lg">
                      {new Date(liveData.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Random Value</div>
                    <div className="stat-value text-secondary">
                      {liveData.randomValue}
                    </div>
                  </div>
                </div>

                <div className="stats stats-vertical shadow w-full">
                  <div className="stat">
                    <div className="stat-title">Counter</div>
                    <div className="stat-value text-accent">
                      {liveData.counter}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Status</div>
                    <div
                      className={`stat-value ${liveData.status === "active" ? "text-success" : "text-error"}`}
                    >
                      {liveData.status}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Chat Messages */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaMessage className="w-5 h-5 text-success" />
              Chat Messages
              {messagesLoading && (
                <FaSpinner className="animate-spin w-4 h-4" />
              )}
            </h4>

            {messagesError && (
              <div className="alert alert-error">
                <span>Error: {messagesError.message}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="gap-2"
                >
                  <FaPaperPlane />
                  Send
                </Button>
              </div>

              {/* Messages List */}
              {messages && Array.isArray(messages) && (
                <div className="space-y-2 max-h-64 overflow-y-auto bg-base-200 p-3 rounded">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-base-100 p-2 rounded text-sm"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-primary">
                          {msg.user || "Unknown"}
                        </span>
                        <span className="text-xs text-base-content/50">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-1">{msg.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="bg-info/10 border border-info/20">
          <div className="card-body">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <FaBolt className="w-4 h-4 text-info" />
              Real-time Notifications
            </h5>
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={index} className="text-sm text-info">
                  • {notification}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Demo Info */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <h5 className="font-semibold mb-2 flex items-center gap-2">
            <FaPlay className="w-4 h-4 text-primary" />
            How to Use This Demo
          </h5>
          <ul className="text-sm space-y-1 text-base-content/80">
            <li>
              • Click &quot;Start Auto-refresh&quot; to begin real-time data
              updates
            </li>
            <li>• Send chat messages to see immediate cache updates</li>
            <li>
              • Check refreshInterval settings and auto-refresh behavior in
              DevTools
            </li>
            <li>
              • Use &quot;Manual Refresh&quot; to force revalidation of all
              caches
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
