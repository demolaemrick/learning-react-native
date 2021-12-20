export default {
	saveSearchPayload: (state, data) => {
		state.searchPayload = data;
	},
	setBookmarkValue: (state, data) => {
		state.bookmarkValue = data;
	},
	setContactPageData: (state, data) => {
		state.contactpage = data;
	}
};
