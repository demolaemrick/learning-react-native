import store from '../store/index';

/**
 * Checks for loggedIn status
 * @returns {Boolean} loggedIn state
 */
export function isLoggedIn() {
	return store.getters['auth/isLoggedIn'];
}
/**
 * Auth guard that allows non-authenticated users only.
 * @param to - next route
 * @param from - previous route
 * @param next - callback to transfer control to the next middleware
 */
export function noAuthOnly(to, from, next) {
	if (isLoggedIn()) {
		next('/');
	} else {
		next();
	}
}

/**
 * Auth guard allows authenticated merchants only.
 * @param to - next route
 * @param from - previous route
 * @param next - callback to transfer control to the next middleware
 */
export function requireAuth(to, from, next) {
	if (isLoggedIn()) {
		next();
	} else {
		next({ name: 'Login' });
	}
}

/**
 * Sets a user session and saves it to store
 * @param {Object} user - user data to be saved to session
 */
export function setSession(user) {
	store.commit('auth/setLoggedUser', user, { root: true });
}

/**
 * clears the current session
 */
export function clearSession() {
	setSession({});
}

/**
 * retrieves the current user session from state
 */
export function getSession() {
	return store.getters['auth/getLoggedUser'];
}

/**
 * Calls an action to refresh user token
 */
export function refreshToken() {
	// TODO:  dispatch an action to refresh token
}
