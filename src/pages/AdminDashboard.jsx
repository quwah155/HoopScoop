import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import StatusBadge from "../context/components/StatusBadge";

const AdminDashboard = () => {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState("posts");
  const [pendingPosts, setPendingPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [processingPostId, setProcessingPostId] = useState(null);
  const [processingUserId, setProcessingUserId] = useState(null);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }


  const fetchPendingPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/admin/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) setPendingPosts(data);
      else toast.error(data.message || "Failed to fetch pending posts");
    } catch {
      toast.error("Error fetching posts");
    } finally {
      setLoadingPosts(false);
    }
  }, [token]);

  // =============================
  // FETCH USERS
  // =============================
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) setUsers(data);
      else toast.error(data.message || "Failed to fetch users");
    } catch {
      toast.error("Error fetching users");
    } finally {
      setLoadingUsers(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPendingPosts();
      fetchUsers();
    }
  }, [token, fetchPendingPosts, fetchUsers]);

  // =============================
  // APPROVE POST
  // =============================
  const handleApprove = async (id) => {
    setProcessingPostId(id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Post approved ✅");
        setPendingPosts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      } else {
        toast.error(data.message || "Failed to approve");
      }
    } catch {
      toast.error("Error approving post");
    } finally {
      setProcessingPostId(null);
    }
  };

  // =============================
  // REJECT POST
  // =============================
  const handleReject = async (id) => {
    setProcessingPostId(id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Post rejected ❌");
        setPendingPosts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      } else {
        toast.error(data.message || "Failed to reject");
      }
    } catch {
      toast.error("Error rejecting post");
    } finally {
      setProcessingPostId(null);
    }
  };

  // =============================
  // DELETE POST
  // =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this post?")) return;
    setProcessingPostId(id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Post deleted");
        setPendingPosts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting post");
    } finally {
      setProcessingPostId(null);
    }
  };

  // =============================
  // PROMOTE / DEMOTE USER
  // =============================
  const handleRoleChange = async (targetUser) => {
    const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    if (
      !window.confirm(
        `${newRole === "ADMIN" ? "Promote" : "Demote"} ${targetUser.email} to ${newRole}?`
      )
    )
      return;

    setProcessingUserId(targetUser._id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${targetUser._id}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(`User role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === targetUser._id ? { ...u, role: newRole } : u
          )
        );
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch {
      toast.error("Error updating role");
    } finally {
      setProcessingUserId(null);
    }
  };

  // ---- Derived stats ----
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const verifiedCount = users.filter((u) => u.isVerified).length;

  return (
    <div className="container" style={{ padding: 'clamp(24px, 6vw, 50px) 0 100px' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: "8px" }}>
        Admin Dashboard
      </h1>
      <p style={{ opacity: 0.6, marginBottom: "36px" }}>
        Logged in as <strong>{user?.email}</strong>
      </p>

      {/* ── Stats Bar ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {[
          { label: "Pending Posts", value: loadingPosts ? "…" : pendingPosts.length },
          { label: "Total Users", value: loadingUsers ? "…" : users.length },
          { label: "Admins", value: loadingUsers ? "…" : adminCount },
          { label: "Verified Users", value: loadingUsers ? "…" : verifiedCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass"
            style={{ padding: "20px", textAlign: "center" }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "4px" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
        {["posts", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "btn btn-primary" : "btn"}
            style={{ textTransform: "capitalize" }}
          >
            {tab === "posts"
              ? `Pending Posts${!loadingPosts ? ` (${pendingPosts.length})` : ""}`
              : `Users${!loadingUsers ? ` (${users.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* ================= POSTS TAB ================= */}
      {activeTab === "posts" && (
        <>
          {loadingPosts ? (
            <p>Loading posts…</p>
          ) : pendingPosts.length === 0 ? (
            <div className="glass" style={{ padding: "40px", textAlign: "center", opacity: 0.7 }}>
              🎉 No pending posts — you're all caught up!
            </div>
          ) : (
            pendingPosts.map((post) => (
              <div
                key={post._id}
                className="glass"
                style={{ padding: "24px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <StatusBadge status={post.status} />
                    <h3 style={{ margin: "8px 0 4px" }}>{post.title}</h3>
                    <div style={{ fontSize: "0.8rem", opacity: 0.55 }}>
                      By <strong>{post.author?.email ?? "Unknown"}</strong> ·{" "}
                      {post.category} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <p style={{ marginBottom: "16px", opacity: 0.8 }}>{post.summary}</p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    disabled={processingPostId === post._id}
                    onClick={() => handleApprove(post._id)}
                    className="btn btn-primary"
                  >
                    {processingPostId === post._id ? "Processing…" : "Approve"}
                  </button>
                  <button
                    disabled={processingPostId === post._id}
                    onClick={() => handleReject(post._id)}
                    className="btn"
                  >
                    Reject
                  </button>
                  <button
                    disabled={processingPostId === post._id}
                    onClick={() => handleDelete(post._id)}
                    className="btn"
                    style={{ color: "#ef4444", marginLeft: "auto" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* ================= USERS TAB ================= */}
      {activeTab === "users" && (
        <>
          {loadingUsers ? (
            <p>Loading users…</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {users.map((u) => (
                <div
                  key={u._id}
                  className="glass"
                  style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <strong>{u.email}</strong>
                    {u._id === user._id && (
                      <span style={{ fontSize: "0.75rem", opacity: 0.5, marginLeft: "8px" }}>
                        (you)
                      </span>
                    )}
                    <div style={{ fontSize: "0.82rem", opacity: 0.6, marginTop: "4px" }}>
                      Role: <strong>{u.role}</strong> ·{" "}
                      {u.isVerified ? (
                        <span style={{ color: "#22c55e" }}>✓ Verified</span>
                      ) : (
                        <span style={{ color: "#f59e0b" }}>⚠ Unverified</span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={
                      processingUserId === u._id ||
                      u._id === user._id // prevent self-demotion
                    }
                    onClick={() => handleRoleChange(u)}
                    className="btn btn-primary"
                  >
                    {processingUserId === u._id
                      ? "Updating…"
                      : u.role === "ADMIN"
                      ? "Demote to USER"
                      : "Promote to ADMIN"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
