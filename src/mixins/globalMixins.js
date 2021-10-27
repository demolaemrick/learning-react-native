export default {
	methods: {
		getURLParams(query) {
			/*
			convert object to url query parameter
			*/
			const urlParams = new URLSearchParams(query);
			return urlParams.toString();
		},
		compareArray(mainArray, toBeCompared) {
			//Filter element not found in the mainArray
			return mainArray.filter((x) => toBeCompared.includes(x));
		},
		base64ToObj(str) {
			return JSON.parse(atob(str));
		}
	}
};
