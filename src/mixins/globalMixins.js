export default {
	methods: {
		getURLParams(query) {
			const urlParams = new URLSearchParams(query);
			return urlParams.toString();
		}
	}
};
