import React, {Component} from 'react'
import Header from "../components/Header.jsx"
import Chat from "../components/Chat.jsx"
import UserDetails from "../components/UserDetails.jsx"
import Trigger from "../features/Trigger.js"

// TODO:
//1.Add github to login
//2.change avatorImage feature
//3.change roomAvatorImage feature
//4.to debug the login/tokenLogin/register
//5.to separation AddEventClick into a components
//6.wanan to force use index.html to match all subRouters;
//7.wanan to improve Tigger

export default class AsyncApp extends Component {
  render() {
    const {match} = this.props
    return (
      <Trigger className="container">
        <Header/>
        <Chat match={match}/>
        <UserDetails/>
      </Trigger>
    )
  }
};
