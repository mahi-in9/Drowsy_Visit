// src/pages/ExploreUsers.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  followUser,
  unfollowUser,
} from "../redux/slices/userSlice";
import { accessChat } from "../redux/thunks/chatThunks";
import { setActiveChat } from "../redux/slices/chatSlice";
import { useNavigate } from "react-router-dom";

/** Small presentational card component **/
function UserCard({ user, loading, onFollow, onUnfollow, onMessage }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          {user.profilePic && (
            <img
              src={user.profilePic}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-white">
            {user.name}
          </p>
          <p className="text-sm text-slate-500">@{user.username}</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onMessage}
          className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Message
        </button>

        {user.isFollowing ? (
          <button
            disabled={loading}
            onClick={onUnfollow}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white disabled:opacity-50"
          >
            Unfollow
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={onFollow}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-white disabled:opacity-50"
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
}

/** MAIN PAGE **/
export default function ExploreUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: users, loading, error } = useSelector((s) => s.users);

  const [query, setQuery] = useState("");
  const [localList, setLocalList] = useState([]);
  const [actionLoading, setActionLoading] = useState(new Set());
  const debounceRef = useRef(null);

  /* Load users */
  const loadUsers = useCallback(
    (search = "") => {
      dispatch(fetchUsers(search))
        .unwrap()
        .then((fetched) => setLocalList(fetched || []))
        .catch(() => {});
    },
    [dispatch]
  );

  /* Initial load */
  useEffect(() => {
    loadUsers("");
  }, [loadUsers]);

  /* Debounced search */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadUsers(query.trim()), 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, loadUsers]);

  /* Sync localList with redux list */
  useEffect(() => {
    setLocalList(users);
  }, [users]);

  const setLoading = (id, value) => {
    setActionLoading((prev) => {
      const set = new Set(prev);
      value ? set.add(id) : set.delete(id);
      return set;
    });
  };

  /* Follow with optimistic UI */
  const handleFollow = async (id) => {
    setLocalList((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isFollowing: true } : u))
    );

    setLoading(id, true);
    try {
      await dispatch(followUser(id)).unwrap();
    } catch {
      // rollback
      setLocalList((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isFollowing: false } : u))
      );
    }
    setLoading(id, false);
  };

  /* Unfollow with optimistic UI */
  const handleUnfollow = async (id) => {
    setLocalList((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isFollowing: false } : u))
    );

    setLoading(id, true);
    try {
      await dispatch(unfollowUser(id)).unwrap();
    } catch {
      // rollback
      setLocalList((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isFollowing: true } : u))
      );
    }
    setLoading(id, false);
  };

  /* Start Chat → accessChat → navigate("/") */
  const handleMessage = async (userId) => {
    const result = await dispatch(accessChat(userId));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(setActiveChat(result.payload));
      navigate("/"); // open chat layout
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-xl py-3 px-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Content */}
      {loading && localList.length === 0 ? (
        // Skeleton
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse h-20"
            />
          ))}
        </div>
      ) : localList.length === 0 ? (
        <p className="text-center py-10 text-slate-500">
          {error ? "Failed to load users" : "No users found"}
        </p>
      ) : (
        <div className="space-y-3">
          {localList.map((u) => (
            <UserCard
              key={u._id}
              user={u}
              loading={actionLoading.has(u._id)}
              onFollow={() => handleFollow(u._id)}
              onUnfollow={() => handleUnfollow(u._id)}
              onMessage={() => handleMessage(u._id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
