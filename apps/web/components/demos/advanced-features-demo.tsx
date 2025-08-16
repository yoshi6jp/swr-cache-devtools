"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Card, Badge, Loading, Input, Checkbox } from "rsc-daisyui";
import {
  FaGears,
  FaPlay,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaLink,
  FaLinkSlash,
  FaCube,
} from "react-icons/fa6";
import { fetcher } from "../../utils/fetcher";
import { User, Post, Settings } from "../../types/api";

export function AdvancedFeaturesDemo() {
  const [userId, setUserId] = useState("");
  const [enableUserFetch, setEnableUserFetch] = useState(false);
  const [enableDependentFetch, setEnableDependentFetch] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // 条件付きフェッチ
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useSWR<User>(
    enableUserFetch && userId ? `/api/users/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // 依存関係のあるフェッチ
  const {
    data: userPosts,
    error: postsError,
    isLoading: postsLoading,
  } = useSWR<Post[]>(
    enableDependentFetch && user?.id ? `/api/users/${user.id}/posts` : null,
    fetcher
  );

  // ローカル状態に依存するキー
  const searchQuery = useMemo(() => {
    return showSensitiveData ? "sensitive" : "public";
  }, [showSensitiveData]);

  const {
    data: settings,
    error: settingsError,
    isLoading: settingsLoading,
  } = useSWR<Settings>(`/api/settings?type=${searchQuery}`, fetcher, {
    dedupingInterval: 60000, // 1分間は重複リクエストを防ぐ
    revalidateOnMount: true,
  });

  // SWR設定の比較データ
  const {
    data: compareData,
    error: compareError,
    isLoading: compareLoading,
  } = useSWR<Settings>("/api/settings?type=public", fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const currentUserKey =
    enableUserFetch && userId ? `/api/users/${userId}` : null;
  const currentPostsKey =
    enableDependentFetch && user?.id ? `/api/users/${user.id}/posts` : null;
  const currentSettingsKey = `/api/settings?type=${searchQuery}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Advanced Features Demo</h3>
        <p className="text-base-content/70">
          Experience advanced features like conditional fetching, dependencies,
          and SWR configuration options
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <h4 className="card-title flex items-center gap-2 text-lg">
            <FaGears className="w-5 h-5 text-secondary" />
            Settings Control
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="label">
                  <span className="label-text">User ID</span>
                </label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g: 1, 2, 3..."
                  className="w-full"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center gap-2">
                    {enableUserFetch ? <FaEye /> : <FaEyeSlash />}
                    Enable User Fetch
                  </span>
                  <Checkbox
                    checked={enableUserFetch}
                    onChange={(e) => setEnableUserFetch(e.target.checked)}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center gap-2">
                    {enableDependentFetch ? <FaLink /> : <FaLinkSlash />}
                    Enable Dependent Fetch
                  </span>
                  <Checkbox
                    checked={enableDependentFetch}
                    onChange={(e) => setEnableDependentFetch(e.target.checked)}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Show Sensitive Data</span>
                  <Checkbox
                    checked={showSensitiveData}
                    onChange={(e) => setShowSensitiveData(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="divider">Active SWR Keys</div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge color={currentUserKey ? "success" : "error"} size="sm">
                {currentUserKey ? "ACTIVE" : "INACTIVE"}
              </Badge>
              <span className="text-sm font-mono">
                {currentUserKey || "User fetch disabled"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge color={currentPostsKey ? "success" : "error"} size="sm">
                {currentPostsKey ? "ACTIVE" : "INACTIVE"}
              </Badge>
              <span className="text-sm font-mono">
                {currentPostsKey || "Dependent fetch disabled or waiting"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge color="info" size="sm">
                ACTIVE
              </Badge>
              <span className="text-sm font-mono">{currentSettingsKey}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conditional Fetch */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaEye className="w-5 h-5 text-info" />
              Conditional Fetch
            </h4>

            {!enableUserFetch && (
              <div className="text-center py-8 text-base-content/50">
                <FaEyeSlash className="w-12 h-12 mx-auto mb-4" />
                <p>Fetch disabled</p>
              </div>
            )}

            {enableUserFetch && !userId && (
              <div className="text-center py-8 text-base-content/50">
                <FaCube className="w-12 h-12 mx-auto mb-4" />
                <p>Please enter a User ID</p>
              </div>
            )}

            {userError && (
              <div className="alert alert-error">
                <span>Error: {userError.message}</span>
              </div>
            )}

            {userLoading && (
              <div className="flex justify-center py-8">
                <Loading variant="dots" size="lg" />
              </div>
            )}

            {user && (
              <div className="space-y-3">
                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium">Name</div>
                  <div>{user.name}</div>
                </div>
                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium">Email</div>
                  <div>{user.email}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Dependent Fetch */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaLink className="w-5 h-5 text-success" />
              Dependent Fetch
            </h4>

            {!enableDependentFetch && (
              <div className="text-center py-8 text-base-content/50">
                <FaLinkSlash className="w-12 h-12 mx-auto mb-4" />
                <p>Dependent fetch disabled</p>
              </div>
            )}

            {enableDependentFetch && !user && (
              <div className="text-center py-8 text-base-content/50">
                <FaSpinner className="w-12 h-12 mx-auto mb-4" />
                <p>Waiting for user data...</p>
              </div>
            )}

            {postsError && (
              <div className="alert alert-error">
                <span>Error: {postsError.message}</span>
              </div>
            )}

            {postsLoading && (
              <div className="flex justify-center py-8">
                <Loading variant="dots" size="lg" />
              </div>
            )}

            {userPosts && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {userPosts
                  .slice(0, 3)
                  .map((post: { id: number; title: string; body: string }) => (
                    <div key={post.id} className="bg-base-200 p-3 rounded">
                      <div className="text-sm font-medium truncate">
                        {post.title}
                      </div>
                      <div className="text-xs text-base-content/70 mt-1 line-clamp-2">
                        {post.body}
                      </div>
                    </div>
                  ))}
                {userPosts.length > 3 && (
                  <div className="text-center text-sm text-base-content/50">
                    {userPosts.length - 3} more items...
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Advanced Settings */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaGears className="w-5 h-5 text-secondary" />
              Configuration Comparison
            </h4>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">
                  Dynamic Key (deduping enabled)
                </div>
                {settingsLoading && (
                  <FaSpinner className="animate-spin w-4 h-4" />
                )}
                {settingsError && (
                  <div className="text-error text-sm">Error</div>
                )}
                {settings && (
                  <div className="bg-base-200 p-2 rounded text-sm">
                    Count: {settings.count} | Type: {settings.type}
                  </div>
                )}
              </div>

              <div className="divider my-2"></div>

              <div>
                <div className="text-sm font-medium mb-2">
                  Static Key (auto-update disabled)
                </div>
                {compareLoading && (
                  <FaSpinner className="animate-spin w-4 h-4" />
                )}
                {compareError && (
                  <div className="text-error text-sm">Error</div>
                )}
                {compareData && (
                  <div className="bg-base-200 p-2 rounded text-sm">
                    Count: {compareData.count} | Type: {compareData.type}
                  </div>
                )}
              </div>
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
            <li>
              • Enter User ID and enable fetch to see conditional fetching in
              action
            </li>
            <li>
              • Dependent fetch automatically executes after user data is
              retrieved
            </li>
            <li>
              • Toggle sensitive data display to see different cache keys in
              action
            </li>
            <li>
              • Check DevTools to observe key states and SWR configuration
              effects
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
