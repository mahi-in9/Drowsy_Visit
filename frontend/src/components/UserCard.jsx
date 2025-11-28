// src/components/UserCard.jsx
import React from "react";

/**
 * UserCard
 * - Presentational component for a single user row
 * - Mobile-friendly touch target, accessible
 *
 * Props:
 * - user: object (expects fields: _id, name, username, profilePic, followers, isFollowing)
 * - onFollow: fn
 * - onUnfollow: fn
 * - actionLoading: boolean
 */
export default function UserCard({
  user,
  onFollow,
  onUnfollow,
  actionLoading,
}) {
  const followerCount = Array.isArray(user.followers)
    ? user.followers.length
    : 0;
  const avatarSrc =
    user.profilePic && user.profilePic.trim() !== ""
      ? user.profilePic
      : "/default-avatar.png";

  return (
    <div
      className="flex items-center justify-between gap-3 p-3 border rounded-xl hover:shadow-sm transition-shadow bg-white dark:bg-slate-800"
      role="group"
      aria-label={`User ${user.username}`}
    >
      <div className="flex items-center gap-3">
        <img
          src={avatarSrc}
          alt={`${user.name || user.username} avatar`}
          className="h-12 w-12 rounded-full object-cover border"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {user.name || user.username}
            </span>
            <span className="text-xs text-slate-400">@{user.username}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {followerCount} follower{followerCount === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {user.isFollowing ? (
          <button
            type="button"
            onClick={onUnfollow}
            disabled={actionLoading}
            aria-pressed="true"
            aria-label={`Unfollow ${user.username}`}
            className="inline-flex items-center justify-center px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 disabled:opacity-60"
          >
            {actionLoading ? (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 01-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              "Following"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onFollow}
            disabled={actionLoading}
            aria-pressed="false"
            aria-label={`Follow ${user.username}`}
            className="inline-flex items-center justify-center px-3 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {actionLoading ? (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 01-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              "Follow"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
