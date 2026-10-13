import { useState } from "react";

export default function PostCard({ post, onUpdate, onDelete, showMessage }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.caption || "");
  const [busy, setBusy] = useState(false);

  const initial = (post.username || "?").charAt(0).toUpperCase();

  const handleSave = async () => {
    setBusy(true);
    try {
      await onUpdate(post._id, draft);
      showMessage("success", "Caption updated successfully!");
      setEditing(false);
    } catch (err) {
      showMessage("error", err.message || "Could not update caption.");
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setDraft(post.caption || "");
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    setBusy(true);
    try {
      await onDelete(post._id);
      showMessage("success", "Post deleted successfully!");
    } catch (err) {
      showMessage("error", err.message || "Could not delete post.");
      setBusy(false);
    }
  };

  return (
    <article className="card post-card">
      <header className="post-header">
        <div className="avatar">{initial}</div>
        <div className="post-meta">
          <span className="post-username">{post.username}</span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </header>

      <div className="post-image-wrap">
        <img
          className="post-image"
          src={post.imageUrl}
          alt={post.caption || "post"}
        />
      </div>

      <div className="post-body">
        {editing ? (
          <div className="edit-box">
            <textarea
              rows="2"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Edit caption..."
            />
            <div className="row">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={busy}
              >
                {busy ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleCancel}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="post-caption">
            <strong>{post.username}</strong>{" "}
            {post.caption ? post.caption : <em className="muted">No caption</em>}
          </p>
        )}
      </div>

      {!editing && (
        <div className="post-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setEditing(true)}
            disabled={busy}
          >
            Edit caption
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={busy}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
