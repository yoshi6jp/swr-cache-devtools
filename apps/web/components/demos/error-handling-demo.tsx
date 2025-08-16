"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button, Card, Badge, Loading, Select } from "rsc-daisyui";
import {
  FaTriangleExclamation,
  FaPlay,
  FaArrowsRotate,
  FaSpinner,
  FaCheck,
  FaXmark,
  FaClock,
  FaBug,
} from "react-icons/fa6";

// エラーを含むフェッチャー関数
const errorFetcher = async (url: string) => {
  const response = await fetch(url);

  // 特定のケースでエラーをシミュレート
  if (url.includes("error-500")) {
    throw new Error("Server Error (500)");
  }
  if (url.includes("error-404")) {
    throw new Error("Resource Not Found (404)");
  }
  if (url.includes("error-timeout")) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // タイムアウトシミュレーション
    throw new Error("Request Timeout");
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export function ErrorHandlingDemo() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("normal");
  const [retryAttempts, setRetryAttempts] = useState(0);

  const endpoints = [
    { value: "normal", label: "Normal Endpoint", path: "/api/data" },
    { value: "error-500", label: "500 Error", path: "/api/data/error-500" },
    { value: "error-404", label: "404 Error", path: "/api/data/error-404" },
    {
      value: "error-timeout",
      label: "Timeout Error",
      path: "/api/data/error-timeout",
    },
    { value: "network", label: "Network Error", path: "/api/nonexistent" },
  ];

  const currentEndpoint = endpoints.find((ep) => ep.value === selectedEndpoint);

  // 基本的なエラーハンドリング
  const {
    data: basicData,
    error: basicError,
    isLoading: basicLoading,
    mutate: mutateBasic,
  } = useSWR(currentEndpoint?.path, errorFetcher, {
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    shouldRetryOnError: true,
    onError: (error, key) => {
      console.log(`Error occurred [${key}]:`, error.message);
    },
  });

  // リトライ設定のカスタマイズ
  const {
    data: customRetryData,
    error: customRetryError,
    isLoading: customRetryLoading,
    mutate: mutateCustomRetry,
  } = useSWR(`${currentEndpoint?.path}/custom-retry`, errorFetcher, {
    errorRetryCount: retryAttempts,
    errorRetryInterval: 2000,
    shouldRetryOnError: (error) => {
      // 500エラーのみリトライ、404はリトライしない
      return error.message.includes("500");
    },
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      console.log(`Retry attempt ${retryCount}:`, error.message);

      // 最大リトライ回数に達した場合
      if (retryCount >= retryAttempts) return;

      // 指数バックオフでリトライ
      setTimeout(
        () => revalidate({ retryCount }),
        Math.pow(2, retryCount) * 1000
      );
    },
  });

  // フォールバック機能付き
  const {
    data: fallbackData,
    error: fallbackError,
    isLoading: fallbackLoading,
    mutate: mutateFallback,
  } = useSWR(`${currentEndpoint?.path}/fallback`, errorFetcher, {
    fallback: {
      [`${currentEndpoint?.path}/fallback`]: {
        message: "Fallback Data",
        timestamp: new Date().toISOString(),
        isFallback: true,
      },
    },
    shouldRetryOnError: false,
  });

  const handleRefreshAll = () => {
    mutateBasic();
    mutateCustomRetry();
    mutateFallback();
  };

  const handleEndpointChange = (value: string) => {
    setSelectedEndpoint(value);
  };

  const getStatusIcon = (
    error: Error | undefined,
    loading: boolean,
    data: unknown
  ) => {
    if (loading)
      return <FaSpinner className="animate-spin w-4 h-4 text-warning" />;
    if (error) return <FaXmark className="w-4 h-4 text-error" />;
    if (data) return <FaCheck className="w-4 h-4 text-success" />;
    return <FaClock className="w-4 h-4 text-base-content/50" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Error Handling Demo</h3>
        <p className="text-base-content/70">
          Experience SWR&apos;s error handling, retry features, and fallback
          mechanisms
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <h4 className="card-title flex items-center gap-2 text-lg">
            <FaBug className="w-5 h-5 text-error" />
            Error Simulation Settings
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Test Endpoint</span>
              </label>
              <Select
                value={selectedEndpoint}
                onChange={(e) => handleEndpointChange(e.target.value)}
                className="w-full"
              >
                {endpoints.map((endpoint) => (
                  <option key={endpoint.value} value={endpoint.value}>
                    {endpoint.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Custom Retry Count</span>
              </label>
              <Select
                value={retryAttempts.toString()}
                onChange={(e) => setRetryAttempts(Number(e.target.value))}
                className="w-full"
              >
                <option value="0">No Retry</option>
                <option value="1">1 Time</option>
                <option value="3">3 Times</option>
                <option value="5">5 Times</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              color="primary"
              onClick={handleRefreshAll}
              className="gap-2"
            >
              <FaArrowsRotate />
              Refresh All Data
            </Button>

            <Badge color="warning" size="lg">
              Current Test: {currentEndpoint?.label}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Error Handling */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              {getStatusIcon(basicError, basicLoading, basicData)}
              Basic Error Handling
            </h4>

            <div className="space-y-3">
              <div className="text-sm">
                <Badge color="info" size="sm">
                  errorRetryCount: 3
                </Badge>
                <Badge color="info" size="sm" className="ml-1">
                  errorRetryInterval: 1s
                </Badge>
              </div>

              {basicLoading && (
                <div className="flex justify-center py-4">
                  <Loading variant="dots" size="md" />
                  <span className="ml-2 text-sm">Fetching data...</span>
                </div>
              )}

              {basicError && (
                <div className="alert alert-error">
                  <FaTriangleExclamation />
                  <div>
                    <div className="font-bold">Error Occurred</div>
                    <div className="text-sm">{basicError.message}</div>
                  </div>
                </div>
              )}

              {basicData && (
                <div className="bg-success/10 border border-success/20 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheck className="text-success" />
                    <span className="font-medium text-success">Success</span>
                  </div>
                  <div className="text-sm">
                    <div>Message: {basicData.message}</div>
                    <div>
                      Timestamp:{" "}
                      {new Date(basicData.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Custom Retry Logic */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              {getStatusIcon(
                customRetryError,
                customRetryLoading,
                customRetryData
              )}
              Custom Retry
            </h4>

            <div className="space-y-3">
              <div className="text-sm">
                <Badge color="warning" size="sm">
                  Retry: {retryAttempts} times
                </Badge>
                <Badge color="warning" size="sm" className="ml-1">
                  Exponential Backoff
                </Badge>
              </div>

              {customRetryLoading && (
                <div className="flex justify-center py-4">
                  <Loading variant="dots" size="md" />
                  <span className="ml-2 text-sm">Retrying...</span>
                </div>
              )}

              {customRetryError && (
                <div className="alert alert-warning">
                  <FaTriangleExclamation />
                  <div>
                    <div className="font-bold">Error After Retry</div>
                    <div className="text-sm">{customRetryError.message}</div>
                  </div>
                </div>
              )}

              {customRetryData && (
                <div className="bg-success/10 border border-success/20 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheck className="text-success" />
                    <span className="font-medium text-success">
                      Retry Success
                    </span>
                  </div>
                  <div className="text-sm">
                    <div>Message: {customRetryData.message}</div>
                    <div>
                      Timestamp:{" "}
                      {new Date(customRetryData.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Fallback Data */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              {getStatusIcon(fallbackError, fallbackLoading, fallbackData)}
              Fallback Features
            </h4>

            <div className="space-y-3">
              <div className="text-sm">
                <Badge color="secondary" size="sm">
                  shouldRetryOnError: false
                </Badge>
                <Badge color="secondary" size="sm" className="ml-1">
                  Fallback Enabled
                </Badge>
              </div>

              {fallbackLoading && (
                <div className="flex justify-center py-4">
                  <Loading variant="dots" size="md" />
                  <span className="ml-2 text-sm">Loading fallback...</span>
                </div>
              )}

              {fallbackData && (
                <div
                  className={`p-3 rounded border ${
                    fallbackData.isFallback
                      ? "bg-secondary/10 border-secondary/20"
                      : "bg-success/10 border-success/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheck
                      className={
                        fallbackData.isFallback
                          ? "text-secondary"
                          : "text-success"
                      }
                    />
                    <span
                      className={`font-medium ${fallbackData.isFallback ? "text-secondary" : "text-success"}`}
                    >
                      {fallbackData.isFallback
                        ? "Fallback Data"
                        : "Normal Data"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div>Message: {fallbackData.message}</div>
                    <div>
                      Timestamp:{" "}
                      {new Date(fallbackData.timestamp).toLocaleTimeString()}
                    </div>
                    {fallbackData.isFallback && (
                      <div className="text-secondary mt-1">
                        ※ This is fallback data
                      </div>
                    )}
                  </div>
                </div>
              )}

              {fallbackError && (
                <div className="alert alert-error">
                  <FaTriangleExclamation />
                  <div>
                    <div className="font-bold">Fallback Failed</div>
                    <div className="text-sm">{fallbackError.message}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Demo Info */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <h5 className="font-semibold mb-2 flex items-center gap-2">
            <FaPlay className="w-4 h-4 text-primary" />
            How to Use This Demo
          </h5>
          <ul className="text-sm space-y-1 text-base-content/80">
            <li>• Select different endpoints to test various error cases</li>
            <li>• Change retry count to see different retry strategies</li>
            <li>• Observe error states and retry behavior in DevTools</li>
            <li>
              • Experience graceful degradation with fallback functionality
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
