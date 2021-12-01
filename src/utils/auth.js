import store from '../store/index';

/**
 * Checks for loggedIn status
 * @returns {Boolean} loggedIn state
 */
export function isLoggedIn() {
	return store.getters['auth/isLoggedIn'];
}

/**
 * Checks for user role
 * @returns {Boolean} userrole state
 */
export function userRole() {
	return store.getters['auth/getLoggedUser'].role;
}

/**
 * Checks for logged in user
 * @returns {Object} logged user state
 */
export function loggedInUser() {
	return store.getters['auth/getLoggedUser'];
}

export function loggedInUserStatus() {
	return store.getters['auth/getLoggedUser'].status;
}

/**
 * Auth guard that allows non-authenticated users only.
 * @param to - next route
 * @param from - previous route
 * @param next - callback to transfer control to the next middleware
 */
export function noAuthOnly(to, from, next) {
	if (isLoggedIn() && userRole() === 'user') {
		next('/');
	} else if (isLoggedIn() && (userRole() === 'admin' || userRole() == 'superadmin')) {
		next('/dashboard');
	} else {
		next();
	}
}
/**
 * Auth guard allows users with permissions go to the email hook page.
 * @param to - next route
 * @param from - previous route
 * @param next - callback to transfer control to the next middleware
 */

export function emailGenerationAuth(to, from, next) {
	if (isLoggedIn() && loggedInUser().can_generate_email) {
		next();
	} else {
		next(from.path);
	}
}

/**
 * Auth guard allows authenticated users only.
 * @param to - next route
 * @param from - previous route
 * @param next - callback to transfer control to the next middleware
 */

export function requireUserAuth(to, from, next) {
	let blockedRoutes = ['Search', 'SearchSettings', 'ApiPortal'];
	if (isLoggedIn()) {
		if (['active', 'inactive'].indexOf(loggedInUserStatus()) > -1) {
			next();
		} else if (loggedInUserStatus() === 'suspended' && blockedRoutes.indexOf(to.name) === -1) {
			next();
		} else {
			next('/contact-research');
		}
	} else {
		next({ name: 'Login' });
	}
}
/**
 * Auth guard allows authenticated admins only.
 * @param to - next route
 * @param from - previous route
 * @param next - callback to transfer control to the next middleware
 */
export function requireAdminAuth(to, from, next) {
	if (from.name !== 'ChromeExte') {
		if (isLoggedIn() && (userRole() == 'admin' || userRole() == 'superadmin')) {
			if (['active', 'inactive'].indexOf(loggedInUserStatus()) > -1) {
				next();
			} else {
				next('/contact-research');
			}
		} else {
			next({ name: 'Login' });
		}
	}
}

// export function requireAuth(to, from, next) {
// 	if (isLoggedIn()) {
// 		next();
// 	} else {
// 		next({ name: 'Login' });
// 	}
// }

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
