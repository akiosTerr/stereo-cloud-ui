import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type User = {
    id: string;
    email: string;
    name: string;
    channel_name: string;
};

export type SharedWithUser = {
    id: string;
    name: string;
    email: string;
    channel_name: string;
    shared_at: string;
};

export const shareVideoWithUser = async (videoId: string, userId: string): Promise<any> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${apiUrl}/mux/share`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoId, userId })
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        let errorMessage = 'Failed to share video';
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } else {
                const text = await response.text();
                errorMessage = text || errorMessage;
            }
        } catch (e) {
            // If parsing fails, use default message
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

export const unshareVideoWithUser = async (videoId: string, userId: string): Promise<any> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${apiUrl}/mux/share/${videoId}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        let errorMessage = 'Failed to unshare video';
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } else {
                const text = await response.text();
                errorMessage = text || errorMessage;
            }
        } catch (e) {
            // If parsing fails, use default message
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

export const getSharedVideos = async (): Promise<any[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${apiUrl}/mux/shared`, {
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
        let errorMessage = 'Failed to fetch shared videos';
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } else {
                const text = await response.text();
                errorMessage = text || errorMessage;
            }
        } catch (e) {
            // If parsing fails, use default message
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

export const getUsersVideoIsSharedWith = async (videoId: string): Promise<SharedWithUser[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${apiUrl}/mux/video/${videoId}/shared-with`, {
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
        let errorMessage = 'Failed to fetch shared users';
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } else {
                const text = await response.text();
                errorMessage = text || errorMessage;
            }
        } catch (e) {
            // If parsing fails, use default message
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

export const searchUsers = async (query: string): Promise<User[]> => {
    if (!query || query.trim().length === 0) {
        return [];
    }

    let token = Cookies.get('jwtToken');
    
    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${apiUrl}/users/search?q=${encodeURIComponent(query.trim())}`, {
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
        let errorMessage = 'Failed to search users';
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } else {
                const text = await response.text();
                errorMessage = text || errorMessage;
            }
        } catch (e) {
            // If parsing fails, use default message
        }
        throw new Error(errorMessage);
    }

    // Check if response has content before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        return [];
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
        return [];
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error('Failed to parse search results:', e);
        return [];
    }
};
