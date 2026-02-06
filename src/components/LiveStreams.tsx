import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { ActiveLiveStream, getActiveLiveStreams } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import {
  GridVideo,
  VideoBlock,
  VideoChannelName,
  VideoContent,
  VideoThumbnail,
  VideoTitle,
  TextInput,
} from "../style";

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  display: flex;
  justify-content: center;
  position: relative;
`;
const SearchInput = styled(TextInput)`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 3rem 0.75rem 1rem;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: #9521f3;
    background-color: rgba(255, 255, 255, 0.15);
  }
`;
const SearchIcon = styled(AiOutlineSearch)`
  position: absolute;
  right: 1rem;
  top: 1.5rem;
  transform: translateY(-50%);
  color: #fff;
  font-size: 1.25rem;
  pointer-events: none;
`;
const VideoInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const LiveBadge = styled.span`
  background-color: #e53935;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
`;
const EmptyMessage = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 2rem 0;
  grid-column: 1 / -1;
  text-align: center;
`;
const GridMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: #fff;
  margin: 2rem 0;
`;

const LiveStreams = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<ActiveLiveStream[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getThumbUrl = (playbackId: string) => {
    return `https://image.mux.com/${playbackId}/thumbnail.png?width=445&height=250&time=0`;
  };

  const handleRedirectVideo = (playbackId: string) => {
    navigate(`/player/${playbackId}`);
  };

  const loadStreams = async () => {
    setLoading(true);
    try {
      const data = await getActiveLiveStreams();
      setStreams(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreams();
  }, []);

  const filteredStreams = streams.filter((stream) => {
    const title = (stream.title ?? "").toLowerCase();
    const channel = (stream.user?.channel_name ?? "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || channel.includes(q);
  });

  return (
    <>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search live streams by title or channel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon />
      </SearchContainer>
      <GridVideo>
        {loading ? (
          <GridMessage>Loading live streams...</GridMessage>
        ) : filteredStreams.length === 0 ? (
          <EmptyMessage>
            {searchQuery
              ? `No live streams found matching "${searchQuery}"`
              : "No live streams are currently active."}
          </EmptyMessage>
        ) : (
          filteredStreams.map((stream) => (
            <VideoBlock key={stream.id}>
              <VideoThumbnail
                onClick={() => handleRedirectVideo(stream.playback_id)}
                src={getThumbUrl(stream.playback_id)}
                alt=""
              />
              <VideoContent>
                <VideoTitle>{stream.title || "Untitled stream"}</VideoTitle>
                <VideoInfoContainer>
                  <LiveBadge>Live</LiveBadge>
                  <VideoChannelName
                    onClick={() => {
                      const channel = stream.user?.channel_name;
                      if (channel) navigate(`/profile/${channel}`);
                    }}
                  >
                    {stream.user?.channel_name ?? "Unknown"}
                  </VideoChannelName>
                </VideoInfoContainer>
              </VideoContent>
            </VideoBlock>
          ))
        )}
      </GridVideo>
    </>
  );
};

export default withAuth(LiveStreams);
