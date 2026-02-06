import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { io, Socket } from "socket.io-client";
import {
  fetchLiveComments,
  createLiveComment,
  deleteLiveComment,
  getLiveCommentsSocketUrl,
} from "../api/liveComments";
import { Comment as CommentType } from "../api/types";
import Comment from "./Comment";
import { getUserIdFromToken } from "../utils/jwt";

type Props = {
  videoId: string;
};

const CommentsContainer = styled.div`
  width: 95%;
  margin: 1rem auto;
  background-color: #121213;
  padding: 1.5rem;
  border-radius: 0.6rem;
  @media (max-width: 425px) {
    width: 88vw;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const LiveBadge = styled.span`
  background-color: #e53935;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 90%;
  min-height: 100px;
  padding: 0.75rem;
  background-color: #1a1a1b;
  color: #fff;
  border: 1px solid #2d2d2e;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0.75rem;

  &:focus {
    outline: none;
    border-color: #9521f3;
  }

  &::placeholder {
    color: #666;
  }
`;

const SubmitButton = styled.button`
  background-color: #9521f3;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #7a1ac7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CommentsList = styled.div`
  margin-top: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
`;

const LoadingMessage = styled.p`
  color: #888;
  text-align: center;
  padding: 2rem;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  text-align: center;
  padding: 1rem;
  background-color: #1a1a1b;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const EmptyMessage = styled.p`
  color: #666;
  text-align: center;
  padding: 2rem;
  font-style: italic;
`;

function LiveCommentsSection({ videoId }: Props) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const loadComments = async () => {
    try {
      const data = await fetchLiveComments(videoId);
      setComments(data);
    } catch {
      // Keep previous comments on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUserId(getUserIdFromToken());
    setLoading(true);
    loadComments();
  }, [videoId]);

  useEffect(() => {
    const baseUrl = getLiveCommentsSocketUrl();
    const socket = io(`${baseUrl}/live-comments`, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join-video", { videoId });
    });

    socket.on("new-comment", (comment: CommentType) => {
      if (comment.video_id === videoId) {
        setComments((prev) => {
          if (prev.some((c) => c.id === comment.id)) return prev;
          return [comment, ...prev];
        });
      }
    });

    socket.on("comment-deleted", (payload: { commentId: string }) => {
      setComments((prev) => prev.filter((c) => c.id !== payload.commentId));
    });

    socketRef.current = socket;
    return () => {
      socket.off("connect");
      socket.off("new-comment");
      socket.off("comment-deleted");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("join-video", { videoId });
    }
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (content.length > 1000) {
      setError("Comment must not exceed 1000 characters");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createLiveComment(videoId, content.trim());
      setContent("");
      // New comment will appear via socket "new-comment"
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteLiveComment(videoId, commentId);
      // Removal will be reflected via socket "comment-deleted"
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  const commentsNewestLast = [...comments].reverse();

  return (
    <CommentsContainer>
      <TitleRow>
        <Title>Live chat</Title>
        <LiveBadge>Live</LiveBadge>
      </TitleRow>

      <CommentForm onSubmit={handleSubmit}>
        <TextArea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          placeholder="Add a comment..."
          maxLength={1000}
          disabled={submitting}
        />
        <SubmitButton type="submit" disabled={submitting || !content.trim()}>
          {submitting ? "Posting..." : "Post Comment"}
        </SubmitButton>
      </CommentForm>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading && comments.length === 0 ? (
        <LoadingMessage>Loading live comments...</LoadingMessage>
      ) : comments.length === 0 ? (
        <EmptyMessage>No comments yet. Be the first to comment!</EmptyMessage>
      ) : (
        <CommentsList>
          {commentsNewestLast.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              currentUserId={currentUserId || undefined}
            />
          ))}
        </CommentsList>
      )}
    </CommentsContainer>
  );
}

export default LiveCommentsSection;
