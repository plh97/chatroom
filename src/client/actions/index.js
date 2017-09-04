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
		posts:json.map(child => child)
	};
}

function fetchPosts(subreddit){
	return dispatch => {
		dispatch(requestPosts(subreddit));
		return fetch("/list")
			.then( (response) => {
				return response.json();
			})
			.then((json) => {
				dispatch(receivePosts(subreddit, json));
			});
	};
}

function shouldFetchPosts(state, subreddit){
	const posts = state.postsBySubreddit[subreddit];
	if(!posts){
		return true;
	}else if(posts.isFetching){
		return false;
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