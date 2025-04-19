export interface LoginData {
    email: string
    password: string
}

const GetLoginToken = async ({ email, password }: LoginData, login: Function, setError: Function, setIsLoading: Function) => {
    if (!email || !password) {
        setError('Email and password are required.');
        return;
    }

    setIsLoading(true);
    setError('');

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
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

        login(data.token)
    } catch (err: any) {
        setError(err.message || 'Something went wrong');
    } finally {
        setIsLoading(false);
    }
}

export default GetLoginToken