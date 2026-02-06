import Cookies from "js-cookie";
import { Comment } from "./types";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchLiveComments = async (videoId: string): Promise<Comment[]> => {
  const token = Cookies.get("jwtToken") ?? "";
  const response = await fetch(`${apiUrl}/live-comments/${videoId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch comments: ${error}`);
  }
  const data = await response.json();
  return data;
};

export const createLiveComment = async (
  videoId: string,
  content: string
): Promise<Comment> => {
  const token = Cookies.get("jwtToken");
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await fetch(`${apiUrl}/live-comments/${videoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    const errText = await response.text();
    let message = errText;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.message) message = Array.isArray(parsed.message) ? parsed.message[0] : parsed.message;
    } catch {
      // use errText as message
    }
    throw new Error(message || "Failed to create comment");
  }
  const data = await response.json();
  return data;
};

export const deleteLiveComment = async (
  videoId: string,
  commentId: string
): Promise<void> => {
  const token = Cookies.get("jwtToken");
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await fetch(`${apiUrl}/live-comments/${videoId}/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }
  if (response.status === 403) {
    throw new Error("You can only delete your own comments");
  }
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete comment: ${error}`);
  }
};

export function getLiveCommentsSocketUrl(): string {
  const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
  try {
    const u = new URL(base);
    return `${u.protocol}//${u.host}`;
  } catch {
    return base;
  }
}
