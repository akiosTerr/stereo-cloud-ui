import { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchComments, createComment, deleteComment } from "../api/comments";
import { Comment as CommentType } from "../api/types";
import Comment from "./Comment";
import { getUserIdFromToken } from "../utils/jwt";

type Props = {
    videoId: string;
}

const CommentsContainer = styled.div`
    width: 95%;
    margin: 1rem auto;
    background-color: #121213;
    padding: 1.5rem;
    border-radius: 0.6rem;
`

const Title = styled.h3`
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
`

const CommentForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
`

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
`

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
`

const CommentsList = styled.div`
    margin-top: 1.5rem;
`

const LoadingMessage = styled.p`
    color: #888;
    text-align: center;
    padding: 2rem;
`

const ErrorMessage = styled.p`
    color: #dc3545;
    text-align: center;
    padding: 1rem;
    background-color: #1a1a1b;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
`

const EmptyMessage = styled.p`
    color: #666;
    text-align: center;
    padding: 2rem;
    font-style: italic;
`

function CommentsSection({ videoId }: Props) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        setCurrentUserId(getUserIdFromToken());
        loadComments();
    }, [videoId]);

    const loadComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchComments(videoId);
            setComments(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (content.length > 1000) {
            setError('Comment must not exceed 1000 characters');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await createComment(videoId, content.trim());
            setContent("");
            await loadComments(); // Refresh comments list
        } catch (err: any) {
            setError(err.message || 'Failed to create comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            await loadComments(); // Refresh comments list
        } catch (err: any) {
            setError(err.message || 'Failed to delete comment');
        }
    };

    return (
        <CommentsContainer>
            <Title>Comments</Title>
            
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
                    {submitting ? 'Posting...' : 'Post Comment'}
                </SubmitButton>
            </CommentForm>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {loading ? (
                <LoadingMessage>Loading comments...</LoadingMessage>
            ) : comments.length === 0 ? (
                <EmptyMessage>No comments yet. Be the first to comment!</EmptyMessage>
            ) : (
                <CommentsList>
                    {comments.map((comment) => (
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

export default CommentsSection;
