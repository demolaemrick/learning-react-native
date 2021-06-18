export default {
	logout: (state) => {
		setTimeout(() => state.loggedUser = {}, 50);
		state.isLoggedIn = false;
	},
	setLoggedUser: (state, user) => {
		state.loggedUser = user;
	},
	loginSuccess: (state, data) => {
		state.loggedUser = data;
		state.isLoggedIn = true;
	}
};
