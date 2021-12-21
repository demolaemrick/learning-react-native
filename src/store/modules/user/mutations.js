export default {
	saveSearchPayload: (state, data) => {
		state.searchPayload = data;
	},
	setBookmarkValue: (state, data) => {
		state.bookmarkValue = data;
	},
	setContactPageData: (state, data) => {
		if (data) {
			state.contactpage = data;
		} else {
			state.contactpage = {
				limit: 10,
				page: 1,
				sortQuery: null,
				keyword: '',
				currentPage: 0,
				count: 0,
				nextPage: null,
				total: 0
			};
		}
	}
};
