import MuxUploader from "@mux/mux-uploader-react";
import { useState } from "react";
import { createMuxUpload } from "../api/createEndpoint";
import styled from "styled-components";
import { TextArea, TextInput } from "../style";

const WrapUploader = styled.div`
    width: 367px;
    margin: auto;
`

const Title = styled.h2`
  color: #00ec27;
`

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
`

const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 100px;
    height: 24px;
`

const ToggleInput = styled.input`
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

const ToggleSlider = styled.span`
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
`

interface UploaderProps {
    onSuccess?: Function
}

function Uploader({onSuccess}: UploaderProps) {
    const [endpointUrl, setEndpointUrl] = useState('')
    const [videoTitle, setVideoTitle] = useState('')
    const [description, setDescription] = useState('')
    const [validated, setValidated] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false);

    const validateFields = () => {        
        if(videoTitle.length > 5 && description.length > 0) {
            setValidated(true)
            createMuxUpload(videoTitle, description, isPrivate)
            .then(res => {
                console.log(res);
                setEndpointUrl(res.data.url)
            })
            .catch(console.error);
        }
    }

    const onSuccessUplodHandler = (e: any) => {
        console.log('success');
        console.log(e.target.type);
        onSuccess?.()
    }

    return (
        <WrapUploader>
            <Title>Upload Video</Title>
            <ToggleContainer>
                <ToggleSwitch>
                    <ToggleInput
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    <ToggleSlider />
                    <ToggleLabel $checked={isPrivate}>
                        {isPrivate ? 'Private' : 'Public'}
                    </ToggleLabel>
                </ToggleSwitch>
            </ToggleContainer>
            <TextInput
                type="text" maxLength={40}
                placeholder="title"
                onChange={(e) => setVideoTitle(e.target.value)}
                onBlur={validateFields}
            />
            <TextArea
                placeholder="description"
                onChange={(e) => setDescription(e.target.value)}
                onBlur={validateFields}
            />
            {validated && 
                <MuxUploader endpoint={endpointUrl} onSuccess={onSuccessUplodHandler} />
            }
        </WrapUploader>
    );
}

export default Uploader;
