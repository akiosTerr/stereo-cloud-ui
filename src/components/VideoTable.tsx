import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { getMuxAssets, VideoAsset } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Uploader from "./Uploader";
import { deleteMuxVideo } from "../api/deleteVideo";

const Title = styled.h2`
  color: #00ec27;
`
const GridVideo = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns:  repeat(5, 1fr);
`
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const DeleteButton = styled.button`
  color: white;
  background-color: red;
`

const ShareButton = styled.button`
  color: white;
  background-color: #04da04;
`

const VideoThumbnail = styled.img`
  cursor: pointer;
  width: 214px;
  height: 121px;
`

const VideoBlock = styled.div`
  display: flex;
  flex-direction: column;
  background-color: gray;
  padding: 10px;
  border-radius: 0.6rem;
`

const VideoTable = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoAsset[]>([])

  const getThumbUrl = (id: string) => {
    return `https://image.mux.com/${id}/thumbnail.png?width=214&height=121&time=2`
  }

  const handleRedirectVideo = (playbackId: string) => {
    navigate(`/player/${playbackId}`);
  };

  const updateVideos = () => {
    getMuxAssets()
      .then((res) => {
        setVideos(res)
      })
  }

  useEffect(() => {
    updateVideos()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("delete this?")) {
      await deleteMuxVideo(id)
      updateVideos()
    } else {
      console.log("canceled");
    }
  }

  const errorHandler = (error: string) => {
    console.log(error);
  }

  return (
    <>
      <Title>Upload Video</Title>
      <Uploader onSuccess={updateVideos}/>
      <Title>View Videos</Title>
      <GridVideo>
        {videos.map((item) => (
          <VideoBlock key={item.id}>
            <div>
              <VideoThumbnail onClick={() => {
                handleRedirectVideo(item.playback_id);
              }} src={getThumbUrl(item.playback_id)} alt="" />
              <h2>{item.title}</h2>
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDelete(item.id)}>Delete</DeleteButton>
              <ShareButton>Share</ShareButton>
            </ButtonRow>
          </VideoBlock>
        ))}
      </GridVideo>
    </>
  )
}

export default withAuth(VideoTable);
