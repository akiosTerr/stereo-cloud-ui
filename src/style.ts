import styled from "styled-components";

export const TextInput = styled.input`
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