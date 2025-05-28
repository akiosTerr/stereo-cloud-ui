import MuxUploader from "@mux/mux-uploader-react";
import { useState } from "react";
import { createMuxUpload } from "../api/createEndpoint";
import styled from "styled-components";
import { TextInput } from "../style";

const WrapUploader = styled.div`
    width: 367px;
    margin: auto;
`

interface UploaderProps {
    onSuccess: Function
}

function Uploader({onSuccess}: UploaderProps) {
    const [endpointUrl, setEndpointUrl] = useState('')
    const [videoTitle, setVideoTitle] = useState('')
    const [validated, setValidated] = useState(false)

    const validateFields = () => {
        console.log(validated);
        
        if(videoTitle.length > 5) {
            setValidated(true)
            createMuxUpload(videoTitle)
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
        onSuccess()
    }

    return (
        <WrapUploader>
            <TextInput
                type="text" maxLength={40}
                placeholder="title"
                onChange={(e) => setVideoTitle(e.target.value)}
                onBlur={validateFields}
            />
            {validated && 
                <MuxUploader endpoint={endpointUrl} onSuccess={onSuccessUplodHandler} />
            }
        </WrapUploader>
    );
}

export default Uploader;
