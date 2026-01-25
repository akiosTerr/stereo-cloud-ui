import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { fetchVideoToken, FormatedVideoAsset, getMuxAssets, getMuxPrivateAssets, VideoAsset } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { deleteMuxVideo } from "../api/deleteVideo";
import Cookies from "js-cookie";

const Title = styled.h2`
  color: #00ec27;
`
const Title2 = styled.h2`
  color: #9521f3;
`
const ChannelName = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const GridVideo = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns:  repeat(3, 1fr);
  @media (max-width: 768px) {
    grid-template-columns:  repeat(1, 1fr);
  }
`
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const DeleteButton = styled.button`
  color: red;
  background-color: transparent;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid red;
  }
`

const ShareButton = styled.button`
  color: #04da04;
  background-color: transparent;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #04da04;
  }
`

const VideoThumbnail = styled.img`
  cursor: pointer;
  width: 100%;
  height: 250px;
  @media (max-width: 480px) {
    width: 400px;
    margin: 0 auto;
  }
`

const VideoBlock = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #000;
  padding: 10px;
  border-radius: 0.6rem;
`

type VideoAssetWithTokens = FormatedVideoAsset & {
    tokenVideo?: string;
    tokenThumbnail?: string;
}


const VideoTable = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<FormatedVideoAsset[]>([])
  const [privateVideos, setPrivateVideos] = useState<VideoAssetWithTokens[]>([])

  const getThumbUrl = (id: string, isPrivate: boolean = false) => {
    if (!isPrivate) {
      return `https://image.mux.com/${id}/thumbnail.png?width=445&height=250&time=2`
    } else {
      const token = isPrivate ? privateVideos.find(v => v.playback_id === id)?.tokenThumbnail : null
      return `https://image.mux.com/${id}/thumbnail.png?width=445&height=250&time=2&token=${token}`
    }
  }

  const handleRedirectVideo = (playbackId: string, isPrivate: boolean = false, description: string = '') => {
   if(isPrivate) {  
    const token = privateVideos.find(v => v.playback_id === playbackId)?.tokenVideo
    navigate(`/player/${playbackId}`, { state: { token, description } });
   } else {
    navigate(`/player/${playbackId}`, { state: { description } });
   }
  };

  const signTokens = async (data: FormatedVideoAsset[]) => {
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

  const getChannelName = () => {
    const channelName = Cookies.get('channel_name')
    if (channelName) {
      return channelName
    } else {
      return ''
    }
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
      <ChannelName>{getChannelName()}</ChannelName>
      <Title>Public Videos</Title>
      <GridVideo>
        {videos.map((item) => (
          <VideoBlock key={item.id}>
            <div>
              <VideoThumbnail onClick={() => {
                handleRedirectVideo(item.playback_id, item.isPrivate, item.description);
              }} src={getThumbUrl(item.playback_id, item.isPrivate)} alt="" />
              <h2>{item.title}</h2>
              {/* <p>{item.status}</p> */}
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDelete(item.id, item.asset_id)}>Delete</DeleteButton>
              <ShareButton>Share</ShareButton>
            </ButtonRow>
          </VideoBlock>
        ))}
      </GridVideo>
      <Title2>Private Videos</Title2>
      <GridVideo>
        {privateVideos.map((item) => (
          <VideoBlock key={item.id}>
            <div>
              <VideoThumbnail onClick={() => {
                handleRedirectVideo(item.playback_id, item.isPrivate, item.description);
              }} src={getThumbUrl(item.playback_id, item.isPrivate)} alt="" />
              <h2>{item.title}</h2>
              {/* <p>{item.status}</p> */}
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
