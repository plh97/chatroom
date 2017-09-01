import { combineReducers } from 'redux'
import {
  REQUEST_POSTS,
  RECEIVE_POSTS,
  INPUT_SUBREDDIT
} from '../actions'

function posts(
  state = {
    isFetching:false,
    items: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_POSTS:
      return Object.assign({},state,{
        isFetching:true
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        items: action.posts,
        isFetching:false
      })
    default:
      return state
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      })
    default:
      return state
  }
}

function inputSubreddit(state='java',action){
  switch(action.type){
    case INPUT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  inputSubreddit
})

export default rootReducer