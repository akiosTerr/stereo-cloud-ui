import { useState, useEffect } from "react";
import styled from "styled-components";
import { searchUsers, shareVideoWithUser, unshareVideoWithUser, getUsersVideoIsSharedWith, User, SharedWithUser } from "../api/shareVideo";

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
  max-height: 80vh;
  overflow-y: auto;
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

const SearchInput = styled.input`
  width: 95%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #333;
  border-radius: 0.5rem;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  &:focus {
    border-color: #9521f3;
    outline: none;
  }
`;

const UserList = styled.div`
  margin-bottom: 1.5rem;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: #2a2a2a;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  &:hover {
    border-color: #555;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: #fff;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  color: #aaa;
  font-size: 0.875rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 0.5rem;
  &:hover {
    opacity: 0.8;
  }
`;

const ShareButton = styled(ActionButton)`
  background-color: #04da04;
  color: #000;
  &:hover {
    border-color: #04da04;
  }
`;

const UnshareButton = styled(ActionButton)`
  background-color: #ff4444;
  color: #fff;
  &:hover {
    border-color: #ff4444;
  }
`;

const SharedSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333;
`;

const SectionTitle = styled.h3`
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const EmptyMessage = styled.div`
  color: #aaa;
  text-align: center;
  padding: 1rem;
  font-style: italic;
`;

const LoadingMessage = styled.div`
  color: #aaa;
  text-align: center;
  padding: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  padding: 1rem;
  background-color: #2a1a1a;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

interface ShareModalProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  onShareUpdate?: () => void;
}

const ShareModal = ({ videoId, isOpen, onClose, onShareUpdate }: ShareModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [sharedWith, setSharedWith] = useState<SharedWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search users");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Load shared users when modal opens
  useEffect(() => {
    if (isOpen && videoId) {
      loadSharedUsers();
    }
  }, [isOpen, videoId]);

  const loadSharedUsers = async () => {
    try {
      setError(null);
      const users = await getUsersVideoIsSharedWith(videoId);
      setSharedWith(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shared users");
    }
  };

  const handleShare = async (userId: string) => {
    try {
      setActionLoading(userId);
      setError(null);
      await shareVideoWithUser(videoId, userId);
      await loadSharedUsers();
      if (onShareUpdate) {
        onShareUpdate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share video");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnshare = async (userId: string) => {
    try {
      setActionLoading(userId);
      setError(null);
      await unshareVideoWithUser(videoId, userId);
      await loadSharedUsers();
      if (onShareUpdate) {
        onShareUpdate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unshare video");
    } finally {
      setActionLoading(null);
    }
  };

  const isSharedWith = (userId: string) => {
    return sharedWith.some(user => user.id === userId);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Share Video</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SearchInput
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading && <LoadingMessage>Searching...</LoadingMessage>}

        {searchQuery.trim() && !loading && (
          <UserList>
            {searchResults.length === 0 ? (
              <EmptyMessage>No users found</EmptyMessage>
            ) : (
              searchResults.map((user) => {
                const isShared = isSharedWith(user.id);
                const isLoading = actionLoading === user.id;

                return (
                  <UserItem key={user.id}>
                    <UserInfo>
                      <UserName>{user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                    {isShared ? (
                      <UnshareButton
                        onClick={() => handleUnshare(user.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "..." : "Unshare"}
                      </UnshareButton>
                    ) : (
                      <ShareButton
                        onClick={() => handleShare(user.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "..." : "Share"}
                      </ShareButton>
                    )}
                  </UserItem>
                );
              })
            )}
          </UserList>
        )}

        {sharedWith.length > 0 && (
          <SharedSection>
            <SectionTitle>Shared With:</SectionTitle>
            {sharedWith.map((user) => {
              const isLoading = actionLoading === user.id;
              return (
                <UserItem key={user.id}>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                  <UnshareButton
                    onClick={() => handleUnshare(user.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Unshare"}
                  </UnshareButton>
                </UserItem>
              );
            })}
          </SharedSection>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ShareModal;
