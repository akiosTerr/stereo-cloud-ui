import { AiOutlineHome, AiOutlineUpload, AiOutlineUser } from "react-icons/ai";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
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
`

const MainLinks = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    flex: 1;
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

const DropdownMenu = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background-color: #2a2a2a;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 180px;
    opacity: ${props => props.isOpen ? 1 : 0};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
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

function Navbar({ }: Props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

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
        logout();
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <WrapNavbar>
            <MainLinks>
                <LinkNavbar title="Home" to="/"><AiOutlineHome size={24} /></LinkNavbar>
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
                <DropdownMenu isOpen={isDropdownOpen}>
                    <DropdownItem title="Logout" onClick={handleLogout}>
                        <FiLogOut size={18} />
                        Logout
                    </DropdownItem>
                </DropdownMenu>
            </UserMenuContainer>
        </WrapNavbar>
    )
}

export default Navbar;