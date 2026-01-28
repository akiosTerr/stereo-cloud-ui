import Cookies from "js-cookie";
import { Comment } from "./types";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchComments = async (videoId: string): Promise<Comment[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/video/${videoId}/comments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch comments: ${error}`);
    }

    const data = await response.json();
    return data;
};

export const createComment = async (videoId: string, content: string): Promise<Comment> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${apiUrl}/mux/video/${videoId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create comment: ${error}`);
    }

    const data = await response.json();
    return data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${apiUrl}/mux/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }   
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    if (response.status === 403) {
        throw new Error('You can only delete your own comments');
    }

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete comment: ${error}`);
    }
};
