import React from 'react';
import { Navbar } from '../../../utils/theme'
import styled from 'styled-components';
import Logo from '../../../constants/assets/images/1.png'
import AuthService from '../../../services/AuthService'

const LogoImage = styled.img`
    height: 5em;
    width: auto;
`

const Header = () => {

    const isLogged = AuthService.isLoggedIn()
    return (
        <Navbar>
            <LogoImage src={Logo} alt="logo" />
        </Navbar>
    )
}

export default Header;