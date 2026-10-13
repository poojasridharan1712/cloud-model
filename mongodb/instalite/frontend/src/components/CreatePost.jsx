import { useState } from "react";

export default function CreatePost({ onCreate, showMessage }) {
  const [username, setUsername] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const reset = () => {
    setUsername("");
    setCaption("");
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      showMessage("error", "Please enter a username.");
      return;
    }
    if (!image) {
      showMessage("error", "Please choose an image to upload.");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({ username: username.trim(), caption, image });
      showMessage("success", "Post created successfully!");
      reset();
    } catch (err) {
      showMessage("error", err.message || "Could not create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card create-card" onSubmit={handleSubmit}>
      <h2 className="card-title">Create a new post</h2>

      <div className="field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="e.g. pooja"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="caption">Caption</label>
        <textarea
          id="caption"
          rows="2"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="image">Image</label>
        <input id="image" type="file" accept="image/*" onChange={handleFile} />
      </div>

      {preview && (
        <div className="preview-wrap">
          <img className="preview" src={preview} alt="preview" />
        </div>
      )}

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Posting..." : "Share Post"}
      </button>
    </form>
  );
}
