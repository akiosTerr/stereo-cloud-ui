import React, { useState } from 'react';
import styled from 'styled-components';
import GetLoginToken from '../api/auth';

const Container = styled.div`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const FormWrapper = styled.div`
  background: #2a3133;
  border: 2px solid white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 360px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  margin-top: 0;
  color: #ddd5e4;
`;

const Input = styled.input`
  width: auto;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    border-color: #0077ff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #0077ff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #005fcc;
  }
`;

const Error = styled.p`
  color: red;
  margin-top: 0.5rem;
  text-align: center;
`;


interface LoginFormType {
  login: Function
}

function LoginPage({login}:LoginFormType) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loginData = {
      email,
      password
    }
    GetLoginToken(loginData, login, setError, setIsLoading)

  };

  return (
    <Container>
    <FormWrapper>
      <Title>Login</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Sign In'}
        </Button>
        {error && <Error>{error}</Error>}
      </Form>
    </FormWrapper>
  </Container>
  );
};

export default LoginPage;
