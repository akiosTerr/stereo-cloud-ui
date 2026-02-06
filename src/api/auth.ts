export interface LoginData {
    email: string
    password: string
}

export interface SignupData {
    email: string
    password: string
    name: string
    channel_name: string
    turnstileToken: string
}

export interface AuthResponse {
    access_token: string
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const GetLoginToken = async ({ email, password }: LoginData, login: Function, setError: Function, setIsLoading: Function) => {
    if (!email || !password) {
        setError('Email and password are required.');
        return;
    }

    setIsLoading(true);
    setError('');

    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');            
        }
        
        login(data.access_token, data.channel_name)
    } catch (err: any) {
        setError(err.message || 'Something went wrong');
    } finally {
        setIsLoading(false);
    }
}

export const signup = async (
    payload: SignupData,
    setError: (msg: string) => void,
    setIsLoading: (loading: boolean) => void,
): Promise<{ success: boolean; message?: string }> => {
    const { email, password, name, channel_name, turnstileToken } = payload;
    if (!email || !password || !name || !channel_name || !turnstileToken) {
        setError('All fields and verification are required.');
        return { success: false };
    }
    setIsLoading(true);
    setError('');
    try {
        const response = await fetch(`${apiUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, channel_name, turnstileToken }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        return { success: true, message: data.message };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        return { success: false };
    } finally {
        setIsLoading(false);
    }
};

export const resendConfirmationEmail = async (
    email: string,
    setError: (msg: string) => void,
    setSuccess: (msg: string) => void,
    setIsLoading: (loading: boolean) => void
): Promise<{ success: boolean; message?: string }> => {
    if (!email?.trim()) {
        setError('Email is required.');
        return { success: false };
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
        const response = await fetch(`${apiUrl}/auth/resend-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim() }),
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.message || 'Failed to resend confirmation email.');
            return { success: false };
        }
        if (data.sent) {
            setSuccess('Confirmation email sent. Please check your inbox.');
        } else {
            setSuccess(data.message || 'No pending verification for this email.');
        }
        return { success: true, message: data.message };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        return { success: false };
    } finally {
        setIsLoading(false);
    }
};

export const confirmEmail = async (token: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
        const response = await fetch(`${apiUrl}/auth/confirm-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        if (!response.ok) {
            return { success: false, error: data.message || 'Confirmation failed' };
        }
        return { success: true, message: data.message };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Confirmation failed';
        return { success: false, error: message };
    }
};

export const validateToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/auth/validateToken`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.ok;
    } catch (error) {
        return false;
    }
};

export default GetLoginToken