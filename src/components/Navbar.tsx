import { AiOutlineHome, AiOutlineUpload, AiOutlineUser, AiOutlinePlayCircle  } from "react-icons/ai";
import { FiLogOut, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Cookies from "js-cookie";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/auth_hook";
type Props = {}

const WrapNavbar = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #fff;
    position: relative;
    
    @media (max-width: 768px) {
        justify-content: flex-end;
        padding: 0 1rem;
    }
`

const MainLinks = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-left: 132px;
    
    @media (max-width: 768px) {
        display: none;
    }
`

const LinkNavbar = styled(Link)`
    margin: 0 1rem;
    color: #fff;
    text-decoration: none;
    font-size: 1.5rem;
`

const LastLinkNavbar = styled(LinkNavbar)`
    margin: 0;
`

const UserMenuContainer = styled.div`
    margin-left: auto;
    position: relative;
    display: flex;
    align-items: center;
    
    @media (max-width: 768px) {
        display: none;
    }
`

const UserMenuButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    
    &:hover {
        opacity: 0.8;
    }
`

const DropdownMenu = styled.div<{ isopen: boolean }>`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background-color: #2a2a2a;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 180px;
    opacity: ${props => props.isopen ? 1 : 0};
    visibility: ${props => props.isopen ? 'visible' : 'hidden'};
    transform: ${props => props.isopen ? 'translateY(0)' : 'translateY(-10px)'};
    transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
    z-index: 1000;
`

const DropdownItem = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    text-align: left;
    
    &:hover {
        background-color: #3a3a3a;
    }
    
    &:first-child {
        border-radius: 8px 8px 0 0;
    }
    
    &:last-child {
        border-radius: 0 0 8px 8px;
    }
`

const MobileMenuButton = styled.button`
    display: none;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    
    @media (max-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    &:hover {
        opacity: 0.8;
    }
`

const Overlay = styled.div<{ isopen: boolean }>`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: ${props => props.isopen ? 1 : 0};
    visibility: ${props => props.isopen ? 'visible' : 'hidden'};
    transition: opacity 0.3s, visibility 0.3s;
    
    @media (max-width: 768px) {
        display: block;
    }
`

const SidePanel = styled.div<{ isopen: boolean }>`
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background-color: #1a1a1a;
    z-index: 1000;
    transform: ${props => props.isopen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    
    @media (max-width: 768px) {
        display: block;
    }
`

const SidePanelHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #333;
`

const SidePanelTitle = styled.h2`
    margin: 0;
    color: #fff;
    font-size: 1.25rem;
`

const SidePanelCloseButton = styled.button`
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    
    &:hover {
        opacity: 0.8;
    }
`

const SidePanelContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
`

const SidePanelLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    color: #fff;
    text-decoration: none;
    font-size: 1.1rem;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #2a2a2a;
    }
`

const SidePanelUserSection = styled.div`
    padding: 1rem 1.5rem;
    border-top: 1px solid #333;
    margin-top: auto;
`

const SidePanelUserLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    color: #fff;
    text-decoration: none;
    font-size: 1rem;
    margin-bottom: 0.5rem;
`

const SidePanelLogoutButton = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    text-align: left;
    
    &:hover {
        opacity: 0.8;
    }
`

function Navbar({ }: Props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sidePanelRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    const getChannelName = () => {
        const channelName = Cookies.get('channel_name')
        if (channelName) {
            return channelName
        } else {
            return ''
        }
    }

    const handleLogout = () => {
        setIsDropdownOpen(false);
        setIsSidePanelOpen(false);
        logout();
    }
    
    const handleSidePanelClose = () => {
        setIsSidePanelOpen(false);
    }
    
    const handleSidePanelLinkClick = () => {
        setIsSidePanelOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (sidePanelRef.current && !sidePanelRef.current.contains(event.target as Node)) {
                if (isSidePanelOpen) {
                    setIsSidePanelOpen(false);
                }
            }
        };

        if (isDropdownOpen || isSidePanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen, isSidePanelOpen]);
    
    useEffect(() => {
        if (isSidePanelOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidePanelOpen]);

    return (
        <>
            <WrapNavbar>
                <MobileMenuButton onClick={() => setIsSidePanelOpen(true)}>
                    <FiMenu size={24} />
                </MobileMenuButton>
                <MainLinks>
                    <LinkNavbar title="Home" to="/"><AiOutlineHome size={24} /></LinkNavbar>
                    <LinkNavbar title="Live Streams" to="/live-streams"><AiOutlinePlayCircle size={24} /></LinkNavbar>
                    <LinkNavbar title="Upload" to="/upload"><AiOutlineUpload size={24} /></LinkNavbar>
                    <LinkNavbar title="Control Panel" to="/controlpanel"><AiOutlineUser size={24} /></LinkNavbar>
                </MainLinks>
                <UserMenuContainer ref={dropdownRef}>
                    <LastLinkNavbar title="Profile" to={`/profile/${getChannelName()}`}>
                         {getChannelName()}
                    </LastLinkNavbar>
                    <UserMenuButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <FiChevronDown size={20} />
                    </UserMenuButton>
                    <DropdownMenu isopen={isDropdownOpen}>
                        <DropdownItem title="Logout" onClick={handleLogout}>
                            <FiLogOut size={18} />
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UserMenuContainer>
            </WrapNavbar>
            <Overlay isopen={isSidePanelOpen} onClick={handleSidePanelClose} />
            <SidePanel ref={sidePanelRef} isopen={isSidePanelOpen}>
                <SidePanelHeader>
                    <SidePanelTitle>Menu</SidePanelTitle>
                    <SidePanelCloseButton onClick={handleSidePanelClose}>
                        <FiX size={24} />
                    </SidePanelCloseButton>
                </SidePanelHeader>
                <SidePanelContent>
                    <SidePanelLink title="Home" to="/" onClick={handleSidePanelLinkClick}>
                        <AiOutlineHome size={24} />
                        Home
                    </SidePanelLink>
                    <SidePanelLink title="Upload" to="/upload" onClick={handleSidePanelLinkClick}>
                        <AiOutlineUpload size={24} />
                        Upload
                    </SidePanelLink>
                    <SidePanelLink title="Control Panel" to="/controlpanel" onClick={handleSidePanelLinkClick}>
                        <AiOutlineUser size={24} />
                        Control Panel
                    </SidePanelLink>
                    <SidePanelLink title="Live Streams" to="/live-streams" onClick={handleSidePanelLinkClick}>
                        <AiOutlinePlayCircle size={24} />
                        Live Streams
                    </SidePanelLink>
                </SidePanelContent>
                <SidePanelUserSection>
                    <SidePanelUserLink title="Profile" to={`/profile/${getChannelName()}`} onClick={handleSidePanelLinkClick}>
                        <AiOutlineUser size={20} />
                        {getChannelName()}
                    </SidePanelUserLink>
                    <SidePanelLogoutButton title="Logout" onClick={handleLogout}>
                        <FiLogOut size={18} />
                        Logout
                    </SidePanelLogoutButton>
                </SidePanelUserSection>
            </SidePanel>
        </>
    )
}

export default Navbar;