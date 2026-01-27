import React, { useState } from 'react';
import styled from 'styled-components';
import GetLoginToken from '../api/auth';
import { TextInput } from '../style';

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
      </Form>
    </FormWrapper>
  </Container>
  );
};

export default LoginPage;
