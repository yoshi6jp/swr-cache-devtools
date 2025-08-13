"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button, Card, Badge, Loading } from "rsc-daisyui";
import {
  FaUser,
  FaUsers,
  FaPlay,
  FaArrowsRotate,
  FaTrash,
  FaCheck,
  FaSpinner,
} from "react-icons/fa6";

// Simple fetcher function for API calls
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function BasicOperationsDemo() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Basic SWR hook
  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
    mutate: mutateUsers,
  } = useSWR("/api/users", fetcher);

  // Conditional fetching
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
    mutate: mutateUser,
  } = useSWR(selectedUserId ? `/api/users/${selectedUserId}` : null, fetcher);

  const handleRefreshUsers = () => {
    mutateUsers();
  };

  const handleRefreshUser = () => {
    mutateUser();
  };

  const handleClearUserCache = () => {
    mutateUser(undefined, { revalidate: false });
    setSelectedUserId(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Basic Operations Demo</h3>
        <p className="text-base-content/70">
          Experience basic SWR usage patterns and cache operations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaUsers className="w-5 h-5 text-info" />
              Users List
              <Badge color="info" size="sm">
                SWR Key: /api/users
              </Badge>
            </h4>

            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                color="primary"
                onClick={handleRefreshUsers}
                disabled={usersLoading}
                className="gap-2"
              >
                {usersLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaArrowsRotate />
                )}
                Refetch
              </Button>
            </div>

            {usersError && (
              <div className="alert alert-error">
                <span>Error: {usersError.message}</span>
              </div>
            )}

            {usersLoading && (
              <div className="flex justify-center py-8">
                <Loading variant="dots" size="lg" />
              </div>
            )}

            {users && users.users && Array.isArray(users.users) && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users.users.map(
                  (userData: { id: number; name: string; email: string }) => (
                    <div
                      key={userData.id}
                      className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${
                        selectedUserId === userData.id
                          ? "border-primary bg-primary/10"
                          : "border-base-300 hover:border-base-400"
                      }
                    `}
                      onClick={() => setSelectedUserId(userData.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{userData.name}</div>
                          <div className="text-sm text-base-content/70">
                            {userData.email}
                          </div>
                        </div>
                        {selectedUserId === userData.id && (
                          <FaCheck className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {users &&
              (!users.users ||
                !Array.isArray(users.users) ||
                users.users.length === 0) && (
                <div className="text-center py-8 text-base-content/50">
                  <FaUsers className="w-12 h-12 mx-auto mb-4" />
                  <p>No users found</p>
                </div>
              )}
          </div>
        </Card>

        {/* Selected User Details */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaUser className="w-5 h-5 text-success" />
              User Details
              {selectedUserId && (
                <Badge color="success" size="sm">
                  SWR Key: /api/users/{selectedUserId}
                </Badge>
              )}
            </h4>

            {!selectedUserId && (
              <div className="text-center py-8 text-base-content/50">
                <FaUser className="w-12 h-12 mx-auto mb-4" />
                <p>Please select a user from the left</p>
              </div>
            )}

            {selectedUserId && (
              <>
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    color="success"
                    onClick={handleRefreshUser}
                    disabled={userLoading}
                    className="gap-2"
                  >
                    {userLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaArrowsRotate />
                    )}
                    Refetch
                  </Button>
                  <Button
                    size="sm"
                    color="error"
                    onClick={handleClearUserCache}
                    className="gap-2"
                  >
                    <FaTrash />
                    Clear Cache
                  </Button>
                </div>

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

                {user && user.user && (
                  <div className="space-y-4">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="text-sm font-medium text-base-content/70">
                            Name
                          </label>
                          <p className="text-lg">{user.user.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-base-content/70">
                            Email
                          </label>
                          <p className="text-lg">{user.user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-base-content/70">
                            Age
                          </label>
                          <p className="text-lg">{user.user.age}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-base-content/70">
                            Role
                          </label>
                          <p className="text-lg">{user.user.role}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-base-content/70">
                            Department
                          </label>
                          <p className="text-lg">{user.user.department}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
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
            <li>• Click any user from the list to view their details</li>
            <li>• Use &quot;Refetch&quot; button to revalidate SWR cache</li>
            <li>• Use &quot;Clear Cache&quot; button to delete cache</li>
            <li>• Check cache state changes in DevTools</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
