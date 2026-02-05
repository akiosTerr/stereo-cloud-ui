import { useState } from "react";
import styled from "styled-components";
import { createLiveStream } from "../api/fetchVideos";
import { ToggleContainer, ToggleInput, ToggleSlider, ToggleSwitch } from "../style";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a;
  border-radius: 0.8rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid #333;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #fff;
  margin: 0;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  &:hover {
    border: 1px solid #fff;
    border-radius: 0.25rem;
  }
`;

const Label = styled.label`
  display: block;
  color: #ccc;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.25rem;
  border: 1px solid #333;
  border-radius: 0.5rem;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus {
    border-color: #da2404;
    outline: none;
  }
`;

const ToggleRow = styled.div`
  margin-bottom: 1.5rem;
`;

interface ToggleLabelProps {
  $checked: boolean;
}

const ToggleLabel = styled.span<ToggleLabelProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: black;
  font-weight: 500;
  pointer-events: none;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #da2404;
  color: #000;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) {
    background-color:rgb(224, 44, 20);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

interface CreateLiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateLiveStreamModal = ({ isOpen, onClose, onSuccess }: CreateLiveStreamModalProps) => {
  const [title, setTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      await createLiveStream({ title: title.trim() || undefined, isPrivate });
      onSuccess();
      onClose();
      setTitle("");
      setIsPrivate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create live stream");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setTitle("");
      setIsPrivate(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Create Livestream</ModalTitle>
          <CloseButton onClick={handleClose} type="button" disabled={loading}>
            ×
          </CloseButton>
        </ModalHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ToggleRow>
          <ToggleContainer>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={loading}
              />
              <ToggleSlider />
              <ToggleLabel $checked={isPrivate}>
                {isPrivate ? "Private" : "Public"}
              </ToggleLabel>
            </ToggleSwitch>
          </ToggleContainer>
        </ToggleRow>

        <Label htmlFor="livestream-title">Title</Label>
        <TitleInput
          id="livestream-title"
          type="text"
          placeholder="Stream title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <ConfirmButton onClick={handleConfirm} disabled={loading}>
          {loading ? "Creating…" : "Create Livestream"}
        </ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateLiveStreamModal;
