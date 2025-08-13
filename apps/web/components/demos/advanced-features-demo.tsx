"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Button, Card, Badge, Loading, Input, Checkbox } from "rsc-daisyui";
import {
  FaGears,
  FaPlay,
  FaArrowsRotate,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaLink,
  FaLinkSlash,
  FaCube,
} from "react-icons/fa6";

// Simple fetcher function for API calls
const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
    mutate: mutateUser,
  } = useSWR(
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
    mutate: mutatePosts,
  } = useSWR(
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
    mutate: mutateSettings,
  } = useSWR(`/api/settings?type=${searchQuery}`, fetcher, {
    dedupingInterval: 60000, // 1分間は重複リクエストを防ぐ
    revalidateOnMount: true,
  });

  // SWR設定の比較データ
  const {
    data: compareData,
    error: compareError,
    isLoading: compareLoading,
  } = useSWR("/api/settings?type=public", fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const handleRefreshAll = () => {
    mutateUser();
    mutatePosts();
    mutateSettings();
  };

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
                  <span className="label-text">ユーザーID</span>
                </label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="例: 1, 2, 3..."
                  className="w-full"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center gap-2">
                    {enableUserFetch ? <FaEye /> : <FaEyeSlash />}
                    ユーザー情報を取得
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
                    依存データを取得
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
                  <span className="label-text">機密データ表示</span>
                  <Checkbox
                    checked={showSensitiveData}
                    onChange={(e) => setShowSensitiveData(e.target.checked)}
                  />
                </label>
              </div>

              <Button
                color="primary"
                onClick={handleRefreshAll}
                className="gap-2 w-full"
              >
                <FaArrowsRotate />
                全データ更新
              </Button>
            </div>
          </div>

          <div className="divider">アクティブなSWRキー</div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge color={currentUserKey ? "success" : "error"} size="sm">
                {currentUserKey ? "ACTIVE" : "INACTIVE"}
              </Badge>
              <span className="text-sm font-mono">
                {currentUserKey || "ユーザーフェッチが無効"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge color={currentPostsKey ? "success" : "error"} size="sm">
                {currentPostsKey ? "ACTIVE" : "INACTIVE"}
              </Badge>
              <span className="text-sm font-mono">
                {currentPostsKey || "依存フェッチが無効または待機中"}
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
                <p>フェッチが無効です</p>
              </div>
            )}

            {enableUserFetch && !userId && (
              <div className="text-center py-8 text-base-content/50">
                <FaCube className="w-12 h-12 mx-auto mb-4" />
                <p>ユーザーIDを入力してください</p>
              </div>
            )}

            {userError && (
              <div className="alert alert-error">
                <span>エラー: {userError.message}</span>
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
                  <div className="text-sm font-medium">名前</div>
                  <div>{user.name}</div>
                </div>
                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium">メール</div>
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
                <p>依存フェッチが無効です</p>
              </div>
            )}

            {enableDependentFetch && !user && (
              <div className="text-center py-8 text-base-content/50">
                <FaSpinner className="w-12 h-12 mx-auto mb-4" />
                <p>ユーザーデータを待機中...</p>
              </div>
            )}

            {postsError && (
              <div className="alert alert-error">
                <span>エラー: {postsError.message}</span>
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
                    他 {userPosts.length - 3} 件...
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
                  動的キー (deduping有効)
                </div>
                {settingsLoading && (
                  <FaSpinner className="animate-spin w-4 h-4" />
                )}
                {settingsError && (
                  <div className="text-error text-sm">エラー</div>
                )}
                {settings && (
                  <div className="bg-base-200 p-2 rounded text-sm">
                    設定数: {settings.count} | タイプ: {settings.type}
                  </div>
                )}
              </div>

              <div className="divider my-2"></div>

              <div>
                <div className="text-sm font-medium mb-2">
                  静的キー (自動更新無効)
                </div>
                {compareLoading && (
                  <FaSpinner className="animate-spin w-4 h-4" />
                )}
                {compareError && (
                  <div className="text-error text-sm">エラー</div>
                )}
                {compareData && (
                  <div className="bg-base-200 p-2 rounded text-sm">
                    設定数: {compareData.count} | タイプ: {compareData.type}
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
              •
              ユーザーIDを入力してフェッチを有効にすると条件付きフェッチが動作します
            </li>
            <li>
              • 依存フェッチはユーザーデータが取得された後に自動的に実行されます
            </li>
            <li>
              • 機密データ表示を切り替えると異なるキーでキャッシュが管理されます
            </li>
            <li>
              •
              DevToolsで各キーの状態とSWR設定オプションの効果を確認してください
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
