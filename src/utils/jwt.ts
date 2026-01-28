import Cookies from "js-cookie";

export const getUserIdFromToken = (): string | null => {
    const token = Cookies.get('jwtToken');
    if (!token) {
        return null;
    }

    try {
        // JWT tokens have 3 parts separated by dots: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];
        // Add padding if needed for base64 decoding
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decoded = atob(paddedPayload);
        const parsed = JSON.parse(decoded);

        // The user ID is typically in the 'sub' field for JWT
        return parsed.sub || parsed.userId || null;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};
