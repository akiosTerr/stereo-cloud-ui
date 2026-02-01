import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { confirmEmail } from '../api/auth';

const Container = styled.div`
  min-height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 2rem;
`;

const Card = styled.div`
  background: #2a3133;
  border: 2px solid white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 360px;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  color: #ddd5e4;
`;

const Message = styled.p<{ $error?: boolean }>`
  color: ${(p) => (p.$error ? '#f87171' : '#a5f3fc')};
  margin: 0.5rem 0;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #a78bfa;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #c4b5fd;
  }
`;

function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid confirmation link. Missing token.');
      return;
    }
    confirmEmail(token).then((result) => {
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Email confirmed. You can sign in.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Confirmation failed.');
      }
    });
  }, [token]);

  const goToLogin = () => {
    navigate('/controlpanel');
  };

  return (
    <Container>
      <Card>
        <Title>Email confirmation</Title>
        {status === 'loading' && <Message>Confirming your email...</Message>}
        {status === 'success' && <Message>{message}</Message>}
        {status === 'error' && <Message $error>{message}</Message>}
        {(status === 'success' || status === 'error') && (
          <LinkButton type="button" onClick={goToLogin}>
            Go to sign in
          </LinkButton>
        )}
      </Card>
    </Container>
  );
}

export default ConfirmEmailPage;
