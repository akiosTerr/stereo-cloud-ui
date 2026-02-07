import styled from "styled-components";
import { Comment as CommentType } from "../api/types";

type Props = {
    comment: CommentType;
    onDelete: (commentId: string) => void;
    currentUserId?: string;
}

const CommentContainer = styled.div`
    background-color: #1a1a1b;
    padding: 1rem;
    border-radius: 0.6rem;
    margin-bottom: 0.75rem;
    border: 1px solid #2d2d2e;
`

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
`

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
`

const UserName = styled.span`
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
`

const ChannelName = styled.span`
    color: #888;
    font-size: 0.8rem;
`

const CommentMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

const Timestamp = styled.span`
    color: #666;
    font-size: 0.75rem;
`

const DeleteButton = styled.button`
    background-color: #dc3545;
    color: #fff;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.75rem;
    transition: background-color 0.2s;

    &:hover {
        background-color: #c82333;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

const CommentContent = styled.p`
    color: #fff;
    font-size: 1.5rem;
    text-align: left;
    line-height: 1.5;
    margin: 0;
    word-wrap: break-word;
`

function Comment({ comment, onDelete, currentUserId }: Props) {
    const isOwner = currentUserId === comment.user_id;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            onDelete(comment.id);
        }
    };

    return (
        <CommentContainer>
            <CommentHeader>
                <UserInfo>
                    <UserName>{comment.user.name}</UserName>
                    <ChannelName>@{comment.user.channel_name}</ChannelName>
                </UserInfo>
                <CommentMeta>
                    <Timestamp>{formatDate(comment.created_at)}</Timestamp>
                    {isOwner && (
                        <DeleteButton onClick={handleDelete}>
                            Delete
                        </DeleteButton>
                    )}
                </CommentMeta>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
        </CommentContainer>
    );
}

export default Comment;
