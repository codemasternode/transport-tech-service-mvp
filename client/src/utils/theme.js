import styled from 'styled-components';

export const Container = styled.div`
    background-color: #ffffff;
    margin: 20px 0;
    width: 100%;
    min-height: 80vh;
    min-width: 30%;
    max-width: 1200px;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
    border-radius: 4px;
    padding: 2em;

    @media (max-width: 768px) {
        padding: 1em;
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
        align-items: flex-start;

        &>div{
            width: 100%;
            display: flex;
            display: -moz-flex;
            display: -ms-flexbox;
            justify-content: flex-start;
            -webkit-justify-content:flex-start;
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
`
// box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);