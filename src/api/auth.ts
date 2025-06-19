export interface LoginData {
    email: string
    password: string
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
        
        login(data.access_token)
    } catch (err: any) {
        setError(err.message || 'Something went wrong');
    } finally {
        setIsLoading(false);
    }
}

export default GetLoginToken