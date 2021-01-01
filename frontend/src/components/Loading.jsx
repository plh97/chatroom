import React from 'react'
import { Spinner } from "@chakra-ui/react"
import styled from 'styled-components'
import cs from 'classnames'

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;
    opacity: 0;
    position: absolute;
    transition: 0.1s all ease;
    background: #fff;
`;

export default function FrontendAuth(props) {
    // 如果已经登录
    return (
        <div className='loading'>
            {
                <Wrapper className={cs({ visible: props.isLoading })} {...props}>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size={props.size || 'xl'}
                    />
                </Wrapper>
            }
            {props.children}
        </div>
    )
}
