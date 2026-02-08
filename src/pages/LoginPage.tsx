import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Turnstile from 'react-turnstile';
import GetLoginToken, { signup, resendConfirmationEmail } from '../api/auth';
import { TextInput } from '../style';

const Container = styled.div`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  background: #2a3133;
  border: 2px solid white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 360px;
  margin-top: 5rem;
  @media (max-width: 450px) {
    width: 320px;
    margin-top: 15rem;
  }
`;

const GreenFont = styled.span`
  color: #4ade80;
`;

const PurpleFont = styled.span`
  color: #9521f3;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  margin-top: 0;
  color: #ddd5e4;
`;

const Button = styled.button`
  width: 80%;
  padding: 0.75rem;
  background-color: #9521f3;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #8c00af;
  }
  &:focus-visible {
    background-color: #8c00af;
  }
`;

const Error = styled.p`
  color: red;
  margin-top: 0.5rem;
  text-align: center;
`;

const Success = styled.p`
  color: #4ade80;
  margin-top: 0.5rem;
  text-align: center;
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #a78bfa;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #c4b5fd;
  }
`;

const TurnstileWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;
`;

const ResendButton = styled.button`
  width: 80%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  background: transparent;
  color: #a78bfa;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid #a78bfa;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(167, 139, 250, 0.15);
    color: #c4b5fd;
  }
  &:focus-visible {
    outline: 2px solid #a78bfa;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  color: #ddd5e4;
`;

interface LoginFormType {
  login: (token: string, channel_name: string) => void;
}

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_PUB_KEY || '';

function LoginPage({ login }: LoginFormType) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [channel_name, setChannelName] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = useCallback(() => {
    setError('');
    setSuccessMessage('');
    setTurnstileToken('');
    setTurnstileKey((k) => k + 1);
  }, []);

  const switchToSignup = () => {
    setMode('signup');
    resetForm();
  };

  const switchToLogin = () => {
    setMode('login');
    resetForm();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const loginData = { email, password };
    GetLoginToken(loginData, login, setError, setIsLoading);
  };

  const Logo = styled.img`
    width: 100%;
    height: fit-content;
    object-fit: contain;
  `;

  const isEmailConfirmationError = error.toLowerCase().includes('confirm your email');
  const handleResendConfirmation = () => {
    resendConfirmationEmail(email, setError, setSuccessMessage, setIsLoading);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!turnstileToken && turnstileSiteKey) {
      setError('Please complete the verification.');
      return;
    }
    const result = await signup(
      {
        email,
        password,
        name,
        channel_name,
        turnstileToken,
      },
      setError,
      setIsLoading,
    );
    if (result.success && result.message) {
      setSuccessMessage(result.message);
      setEmail('');
      setPassword('');
      setName('');
      setChannelName('');
      setTurnstileToken('');
      setTurnstileKey((k) => k + 1);
      setTimeout(() => {
        setMode('login');
        setSuccessMessage('');
      }, 3000);
    }
  };

  return (
    <Container>
      <FormWrapper>
        {mode === 'login' ? (
          <>
            <Title>Login</Title>
            <Logo src="/wafflestream_banner_logo.png" alt="Logo" />
            <Form onSubmit={handleLoginSubmit}>
              <TextInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Sign In'}
              </Button>
              {error && <Error>{error}</Error>}
              {isEmailConfirmationError && (
                <ResendButton
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Resend confirmation email'}
                </ResendButton>
              )}
              {mode === 'login' && successMessage && <Success>{successMessage}</Success>}
              <ToggleLink type="button" onClick={switchToSignup}>
                Create account
              </ToggleLink>
            </Form>
          </>
        ) : (
          <>
            <Title>Create account</Title>
            <Logo src="/wafflestream_banner_logo.png" alt="Logo" />
            <Form onSubmit={handleSignupSubmit}>
              <TextInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextInput
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextInput
                type="text"
                placeholder="Channel name"
                value={channel_name}
                onChange={(e) => setChannelName(e.target.value)}
                required
              />
              <TextInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {turnstileSiteKey && (
                <TurnstileWrapper>
                  <Turnstile
                    key={turnstileKey}
                    sitekey={turnstileSiteKey}
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                    onError={(err) => {
                      setTurnstileToken('');
                      console.error('Turnstile error:', err);
                      setError(
                        typeof err === 'string'
                          ? err
                          : 'Verification failed. Check if the Turnstile script is blocked (e.g. ad blocker).'
                      );
                    }}
                  />
                </TurnstileWrapper>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              {error && <Error>{error}</Error>}
              {successMessage && <Success>{successMessage}</Success>}
              <ToggleLink type="button" onClick={switchToLogin}>
                Already have an account? Sign in
              </ToggleLink>
            </Form>
          </>
        )}
      </FormWrapper>
      <Header>
        <HeaderTitle><GreenFont>Stream</GreenFont> & <PurpleFont>Share</PurpleFont> Videos Instantly</HeaderTitle>
      </Header>
    </Container>
  );
}

export default LoginPage;
