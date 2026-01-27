import { AiOutlineHome , AiOutlineUpload, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import styled from "styled-components";

type Props = {}

const WrapNavbar = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #fff;
`

const LinkNavbar = styled(Link)`
    margin: 0 1rem;
    color: #fff;
    text-decoration: none;
    font-size: 1.5rem;
`

function Navbar({ }: Props) {
    return (
        <WrapNavbar>
            <LinkNavbar to="/"><AiOutlineHome  size={24} /></LinkNavbar>
            <LinkNavbar to="/upload"><AiOutlineUpload size={24} /></LinkNavbar>
            <LinkNavbar to="/dashboard"><AiOutlineUser size={24} /></LinkNavbar>
        </WrapNavbar>
    )
}

export default Navbar;