import styled from 'styled-components';

export const Container = styled.div`
    background-color: #ffffff;
    margin: 20px 0;
    width: 100%;
    min-height: 80vh;
    min-width: 30%;
    max-width: 1200px;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
    border-radius: 10px;
    padding: 2em;
    margin-top: 10em;

    @media (max-width: 768px) {
        padding: 1em;
        border-radius: 16px;
        bottom: 0;
    }
`;

export const Headings = styled.div`
    display: flex;
    display: -moz-flex;
    display: -ms-flexbox;
    width: 100%;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    align-items: center;
    -webkit-align-items: center;
    flex-wrap: wrap;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;

        &>div{
            width: 100%;
            display: flex;
            display: -moz-flex;
            display: -ms-flexbox;
            justify-content: center;
            -webkit-justify-content: center;
            align-items: center;
            -webkit-align-items: center;
        }
    }
`;

export const Button = styled.button`
    background: ${props => props.bColor || "inherit"};
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;

    border: none;
    border-radius: 4px;
    color: #ffffff;
    cursor: pointer;
    transition: .5s ease;
    &:hover{
        background-color: orange;
    }
    @media (max-width: 768px) {
        margin: 0 .5em 0 0;
    }
`;

export const ItemDiv = styled.div`
    background-color: #cccccc;
    margin: 1em;
    padding: 0.25em 1em;
    transition: .5s ease;
    border-radius: 4px;
`;

export const RootElement = styled.div`
    // min-height: -webkit-fill-available;
    // height: calc(var(--vh, 1vh) * 100);
    min-height:120vh;
    display: flex;
    background-image: linear-gradient(#f2f2f2 70%, #232f3e 30%);
    justify-content: center;
    @media (max-width: 768px) {
        padding: 1em;
        position: relative;
        bottom: 0;
        background-color: #232f3e;
        background-image:none;
    }
`;

export const Navbar = styled.div`
    width: 100%;
    height: 6em;
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
    background-color: #ffffff;
    display: flex;
    align-items: center;
`;

// background-image: linear-gradient(top, #f2f2f2 70%, #232f3e 30%);

// box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);