import React, {Component} from 'react'
import Slider from "../components/Slider.jsx"
import Body from "../components/Body.jsx"
import Header from "../components/Header.jsx"
import UserDetails from "../components/UserDetails.jsx"
import Trigger from "../features/Trigger.js"
import { Layout } from "antd";
import { Avatar, Icon } from 'antd'
import Content from '../components/Content.jsx'
import { inject, observer } from "mobx-react"
import { colorList } from '../../../config/client.js'
import {
	Route,
	Link
} from 'react-router-dom'

// TODO:
//3.change roomAvatorImage feature
//7.wanan to improve Tigger

const AsyncApp = ({match})=>(
  <Trigger className="container">
    <Slider match={match} />
    <Layout className="body">
      <Header/>
      <Route exact path={match.url} render={() => (
        <h1>Please select a group.</h1>
      )} />
      <Route path={`${match.url}/:group_name`} component={Content} />
    </Layout>
    <UserDetails/>
  </Trigger>
)
export default AsyncApp