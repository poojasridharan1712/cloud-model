import { useCallback, useEffect, useState } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "./api.js";
import CreatePost from "./components/CreatePost.jsx";
import PostCard from "./components/PostCard.jsx";
import Message from "./components/Message.jsx";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
  }, []);

  const closeMessage = useCallback(() => setMessage(null), []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      showMessage("error", err.message || "Could not load posts.");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreate = async (payload) => {
    const post = await createPost(payload);
    setPosts((prev) => [post, ...prev]);
    return post;
  };

  const handleUpdate = async (id, caption) => {
    const updated = await updatePost(id, caption);
    setPosts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updated } : p))
    );
    return updated;
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="logo">
            Insta<span>Lite</span>
          </h1>
          <span className="tagline">DBaaS Lab · MongoDB Atlas</span>
        </div>
      </header>

      <Message message={message} onClose={closeMessage} />

      <main className="container">
        <CreatePost onCreate={handleCreate} showMessage={showMessage} />

        <section className="feed">
          <h2 className="feed-title">Feed</h2>

          {loading && <p className="muted center">Loading posts...</p>}

          {!loading && posts.length === 0 && (
            <div className="empty">
              <p>No posts yet.</p>
              <p className="muted">Create your first post above.</p>
            </div>
          )}

          {!loading &&
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                showMessage={showMessage}
              />
            ))}
        </section>
      </main>

      <footer className="app-footer">
        InstaLite &middot; Experiment 5 &ndash; DBaaS using MongoDB Atlas
      </footer>
    </div>
  );
}
