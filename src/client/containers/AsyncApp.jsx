import React, {Component} from 'react'
import Header from "../components/Header.jsx"
import Chat from "../components/Chat.jsx"
import UserDetails from "../components/UserDetails.jsx"
import Trigger from "../features/Trigger.js"

// TODO:
//2.change avatorImage feature
//3.change roomAvatorImage feature
//4.to debug the login/tokenLogin/register
//7.wanan to improve Tigger

const AsyncApp = ({match})=>(
  <Trigger className="container">
    <Header/>
    <Chat match={match}/>
    <UserDetails/>
  </Trigger>
)
export default AsyncApp