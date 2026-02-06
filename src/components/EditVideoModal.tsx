import { useState, useEffect } from "react";
import styled from "styled-components";
import { updateVideo } from "../api/fetchVideos";

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
  max-width: 420px;
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
  font-size: 1.25rem;
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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #333;
  border-radius: 0.5rem;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus {
    border-color: #9521f3;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #333;
  border-radius: 0.5rem;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  &:focus {
    border-color: #9521f3;
    outline: none;
  }
`;

const Label = styled.label`
  display: block;
  color: #ccc;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  background-color: #2a2a2a;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    border-color: #777;
    background-color: #333;
  }
`;

const SaveButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #04da04;
  background-color: rgba(4, 218, 4, 0.15);
  color: #04da04;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover:not(:disabled) {
    background-color: rgba(4, 218, 4, 0.25);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export type EditVideoModalVideo = {
  id: string;
  title: string;
  description: string;
};

type EditVideoModalProps = {
  isOpen: boolean;
  video: EditVideoModalVideo | null;
  onClose: () => void;
  onSuccess: () => void;
};

const EditVideoModal = ({
  isOpen,
  video,
  onClose,
  onSuccess,
}: EditVideoModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (video) {
      setTitle(video.title ?? "");
      setDescription(video.description ?? "");
      setError(null);
    }
  }, [video]);

  const handleSave = async () => {
    if (!video) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateVideo(video.id, { title, description });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update video");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSaving) onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Edit video</ModalTitle>
          <CloseButton
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
          >
            ×
          </CloseButton>
        </ModalHeader>
        <div>
          <Label htmlFor="edit-video-title">Title</Label>
          <Input
            id="edit-video-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title"
            disabled={isSaving}
          />
          <Label htmlFor="edit-video-description">Description</Label>
          <TextArea
            id="edit-video-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Video description"
            disabled={isSaving}
          />
        </div>
        {error && (
          <p style={{ color: "#e55", fontSize: "0.9rem", margin: "0 0 1rem" }}>
            {error}
          </p>
        )}
        <ButtonRow>
          <CancelButton type="button" onClick={onClose} disabled={isSaving}>
            Cancel
          </CancelButton>
          <SaveButton type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </SaveButton>
        </ButtonRow>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditVideoModal;
