import MuxUploader from "@mux/mux-uploader-react";
import { useEffect, useState } from "react";
import { createMuxUpload } from "../api/createEndpoint";

export default function Uploader() {
    const [endpointUrl, setEndpointUrl] = useState('')
    
    useEffect(() => {
        console.log("api call");
        
        createMuxUpload()
            .then(res => {
                console.log(res);
                setEndpointUrl(res.data.url)
            })
            .catch(console.error);
    }, [])

    return (
        <MuxUploader endpoint={endpointUrl} />
    );
}