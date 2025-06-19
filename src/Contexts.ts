import { createContext, useContext } from "react"

// interface ProfileNameContextType {
//     setProfileName: React.Dispatch<React.SetStateAction<string>>
//     profileName: string
// }

interface AuthContextType {
    isLoggedIn: boolean
    login: Function
    logout: Function
}

export const SetAuthCtx = createContext<AuthContextType | undefined>(undefined);

export const useAuthCtx = () => {
    return useContext(SetAuthCtx)
}

