import styled from "styled-components";

export const TextInput = styled.input`
  width: 80%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    border-color: #9521f3;
    outline: none;
  }
`;

export const DescriptionInput = styled.textarea`
  width: 80%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: #9521f3;
    outline: none;
  }
`

export const GridVideo = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns:  repeat(5, 1fr);
  @media (max-width: 1440px) {
    grid-template-columns:  repeat(3, 1fr);
  }
   @media (max-width: 1024px) {
    grid-template-columns:  repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns:  repeat(1, 1fr);
  }
 
  @media (max-width: 425px) {
    grid-template-columns:  repeat(1, 1fr);
  }
`

export const VideoDuration = styled.p`
  color: #fff;
  margin: 0;
`

export const VideoThumbnail = styled.img`
  cursor: pointer;
  border-radius: 0.6rem;
  width: 100%;
  height: 250px;
  @media (max-width: 768px) {
    width: 445px;
  }
  @media (max-width: 480px) {
    width: 350px;
  }
`

export const VideoBlock = styled.div`
  display: flex;
  flex-direction: column;
  background-color: transparent;
  padding: 10px;
  border-radius: 0.6rem;
  border: 1px solid transparent;
  max-width: 420px;
  margin: 0 auto;
  &:hover {
    border: 1px solid #fff;
  }
`

export const VideoChannelName = styled.p`
  color: #fff;
  margin: 0;
  cursor: pointer;
  &:hover {
    color: #9521f3;
  }
`

export const VideoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
`
export const VideoTitle = styled.p`
  color: #fff;
  margin: 0;
`

export const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
`

export const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 100px;
    height: 24px;
`

export const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
        background-color:rgb(149, 33, 243);
    }
    
    &:not(:checked) + span {
        background-color:rgb(33, 243, 61);
    }

    &:checked + span:before {
        transform: translateX(76px);
    }
`

export const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;

    &:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
`