import React from 'react'
import { Spinner } from "@chakra-ui/react"
import cs from 'classnames'
import './Loading.scoped.scss'

export default function FrontendAuth(props) {
    // 如果已经登录
    return (
        <div className='loading'>
            <div className={cs('wrapper', { visible: props.isloading === 'true' })} {...props}>
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size={props.size || 'xl'}
                />
            </div>
            {props.children}
        </div>
    )
}
