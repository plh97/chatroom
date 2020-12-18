import React from 'react'
import { useSelector } from 'react-redux'
import {
    Spinner
} from "@chakra-ui/react"
import { ACTION_TYPE } from '../utils/constants'
import styled from 'styled-components'
const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 11;
    background: #fff;
`;

export default function FrontendAuth(props) {
    let fetchStatus = useSelector(state => state.fetch)
    // 如果已经登录
    return (
        <div className='loading'>
            {
                fetchStatus === ACTION_TYPE.FETCH_START && <Wrapper>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                </Wrapper>
            }
            {props.children}
        </div>
    )
}
