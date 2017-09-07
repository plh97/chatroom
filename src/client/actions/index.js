// import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = "REQUEST_POSTS";
export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const INPUT_SUBREDDIT = "INPUT_SUBREDDIT";
export const INVALIDATE_SUBREDDIT = "INVALIDATE_SUBREDDIT";

function requestPosts(subreddit){
	return{
		type:REQUEST_POSTS,
		subreddit
	};
}

function receivePosts(subreddit, json){
	return{
		type:RECEIVE_POSTS,
		subreddit,
		posts:json
	};
}

function receiveGets(subreddit, json){
	return{
		type:RECEIVE_POSTS,
		subreddit,
		posts:json.map(child => child)
	};
}

function fetchPosts(subreddit){
	return dispatch => {
		dispatch(requestPosts(subreddit));
		return fetch(subreddit.url,{
			method: "POST",
			body: JSON.stringify(subreddit),
			headers: {
				"Content-Type": "application/json"
			},
		}).then( (response) => {
				return response.json();
			})
			.then((json) => {
				dispatch(receivePosts(subreddit, json));
			});
	};
}

function fetchGets(subreddit){
	return dispatch => {
		dispatch(requestPosts(subreddit));
		return fetch(subreddit)
			.then( (response) => {
				return response.json();
			})
			.then((json) => {
				dispatch(receiveGets(subreddit, json));
			});
	};
}

function shouldFetchPosts(state, subreddit){
	const posts = state.postsBySubreddit[subreddit];
	if(!posts){
		return true;
	}else if(posts.isFetching){
		return false;
	}else {
		return true
	}
}

export function inputSubreddit(subreddit) {
	return {
		type: INPUT_SUBREDDIT,
		subreddit
	};
}

export function invalidateSubreddit(subreddit) {
	return {
		type: INVALIDATE_SUBREDDIT,
		subreddit
	};
}

export function fetchPostsIfNeeded(subreddit) {
	return (dispatch,getState) => {
		if(shouldFetchPosts(getState(), subreddit)){
			return dispatch(fetchPosts(subreddit));
		}
	};
}

export function fetchGetsIfNeeded(subreddit) {
	return (dispatch,getState) => {
		if(shouldFetchPosts(getState(), subreddit)){
			return dispatch(fetchGets(subreddit));
		}
	};
}