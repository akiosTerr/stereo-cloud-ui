import MuxUploader from "@mux/mux-uploader-react";
import { useState } from "react";
import { createMuxUpload } from "../api/createEndpoint";
import styled from "styled-components";
import { DescriptionInput, TextInput, ToggleContainer, ToggleInput, ToggleSlider, ToggleSwitch } from "../style";
import withAuth from "../hoc/PrivateRoute";

const WrapUploader = styled.div`
    width: 367px;
    margin: auto;
`

const Title = styled.h2`
  color: #00ec27;
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
        if(videoTitle.length > 3) {
            setValidated(true)
            createMuxUpload(videoTitle, description, isPrivate)
            .then(res => {
                setEndpointUrl(res.data.url)
            })
            .catch(console.error);
        }
    }

    const onSuccessUplodHandler = () => {
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
            <DescriptionInput
                placeholder="description"
                onChange={(e) => setDescription(e.target.value)}
                onBlur={validateFields}
            />
            {validated && 
                <MuxUploader 
                    maxFileSize={10000000000} 
                    endpoint={endpointUrl} 
                    onSuccess={onSuccessUplodHandler}
                />
            }
        </WrapUploader>
    );
}

export default withAuth(Uploader);
