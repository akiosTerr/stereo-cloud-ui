import { createContext, useContext } from "react"

// interface ProfileNameContextType {
//     setProfileName: React.Dispatch<React.SetStateAction<string>>
//     profileName: string
// }

interface AuthContextType {
    isLoggedIn: Boolean
    login: (token: string, channel_name: string) => void
    logout: () => void
}

export const SetAuthCtx = createContext<AuthContextType | undefined>(undefined);

export const useAuthCtx = () => {
    return useContext(SetAuthCtx)
}

