import Cookies from "js-cookie";
import { MuxAssetResponse } from "./types";


export const getMuxAssets = async (): Promise<MuxAssetResponse> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch('http://localhost:3000/mux/assets',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    const data = await response.json();
    return data;
};