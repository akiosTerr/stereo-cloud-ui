import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { fetchVideoToken, getMuxAssets, getMuxPrivateAssets, VideoAsset } from "../api/fetchVideos";
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

type VideoAssetWithTokens = VideoAsset & {
    tokenVideo?: string;
    tokenThumbnail?: string;
}


const VideoTable = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoAsset[]>([])
  const [privateVideos, setPrivateVideos] = useState<VideoAssetWithTokens[]>([])

  const getThumbUrl = (id: string, isPrivate: boolean = false) => {
    if (!isPrivate) {
      return `https://image.mux.com/${id}/thumbnail.png?width=214&height=121&time=2`
    } else {
      const token = isPrivate ? privateVideos.find(v => v.playback_id === id)?.tokenThumbnail : null
      return `https://image.mux.com/${id}/thumbnail.png?width=214&height=121&time=2&token=${token}`
    }
  }

  const handleRedirectVideo = (playbackId: string, isPrivate: boolean = false) => {
   if(isPrivate) {  
    const token = privateVideos.find(v => v.playback_id === playbackId)?.tokenVideo
    navigate('/player', { state: { playbackId, token } });
   } else {
    navigate('/player', { state: { playbackId } });
   }
  };

  const signTokens = async (data: VideoAsset[]) => {
    const promises = data.map(async(item) => {
        const {tokenVideo, tokenThumbnail} = await fetchVideoToken(item.playback_id)
        return {
          ...item,
          tokenVideo,
          tokenThumbnail
        }
    })
    return Promise.all(promises)
  }
 
  const updateVideos = async () => {
    const data = await getMuxAssets();
    setVideos(data);
  }

  const updatePrivateVideos = async () => {
    const data = await getMuxPrivateAssets();
    const signedVideos = await signTokens(data);
    setPrivateVideos(signedVideos);
  }

  useEffect(() => {
    updateVideos()
    updatePrivateVideos()
  }, [])

  const handleDelete = async (id: string, asset_id: string) => {
    if (confirm("delete this?")) {
      await deleteMuxVideo(id, asset_id)
      updateVideos()
    } else {
      console.log("canceled");
    }
  }

  return (
    <>
      <Title>Upload Video</Title>
      <Uploader onSuccess={updateVideos}/>
      <Title>Public Videos</Title>
      <GridVideo>
        {videos.map((item) => (
          <VideoBlock key={item.id}>
            <div>
              <VideoThumbnail onClick={() => {
                handleRedirectVideo(item.playback_id, item.isPrivate);
              }} src={getThumbUrl(item.playback_id, item.isPrivate)} alt="" />
              <h2>{item.title}</h2>
              <p>{item.status}</p>
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDelete(item.id, item.asset_id)}>Delete</DeleteButton>
              <ShareButton>Share</ShareButton>
            </ButtonRow>
          </VideoBlock>
        ))}
      </GridVideo>
      <Title>Private Videos</Title>
      <GridVideo>
        {privateVideos.map((item) => (
          <VideoBlock key={item.id}>
            <div>
              <VideoThumbnail onClick={() => {
                handleRedirectVideo(item.playback_id, item.isPrivate);
              }} src={getThumbUrl(item.playback_id, item.isPrivate)} alt="" />
              <h2>{item.title}</h2>
              <p>{item.status}</p>
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDelete(item.id, item.asset_id)}>Delete</DeleteButton>
              <ShareButton>Share</ShareButton>
            </ButtonRow>
          </VideoBlock>
        ))}
      </GridVideo>

    </>
  )
}

export default withAuth(VideoTable);
