// Small API helper layer. Requests use relative URLs so Vite's dev proxy
// forwards them to the Express backend at http://localhost:5000.

async function handle(res) {
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export async function getPosts() {
  const res = await fetch("/posts");
  const data = await handle(res);
  return data.posts || [];
}

export async function createPost({ username, caption, image }) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("caption", caption);
  formData.append("image", image);

  const res = await fetch("/posts", { method: "POST", body: formData });
  const data = await handle(res);
  return data.post;
}

export async function updatePost(id, caption) {
  const res = await fetch(`/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption }),
  });
  const data = await handle(res);
  return data.post;
}

export async function deletePost(id) {
  const res = await fetch(`/posts/${id}`, { method: "DELETE" });
  await handle(res);
  return true;
}
