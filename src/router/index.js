import Vue from 'vue';
import VueRouter from 'vue-router';
import Search from '../views/Search/Search.vue';
import SearchResult from '../views/SearchResult/SearchResult.vue';
import SearchItem from '../views/SearchItem/SearchItem.vue';
import SettingsView from '../views/Settings/Settings.vue';

const NotFound = () => import(/* webpackChunkName: 'login' */ '../views/NotFound.vue');
const Login = () => import(/* webpackChunkName: 'login' */ '../views/auth/Login');
const ForgotPassword = () => import(/* webpackChunkName: 'login' */ '../views/auth/ForgotPassword');
const CheckInbox = () => import(/* webpackChunkName: 'login' */ '../views/auth/ForgotPassword/CheckInbox');
const ResetPassword = () => import(/* webpackChunkName: 'login' */ '../views/auth/ResetPassword');

Vue.use(VueRouter);

const routes = [
	{
		path: '*',
		name: 'not-found',
		component: NotFound
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/forgot-password',
		name: 'ForgotPassword',
		component: ForgotPassword
	},
	{
		path: '/check-inbox',
		name: 'CheckInbox',
		component: CheckInbox
	},
	{
		path: '/reset-password',
		name: 'ResetPassword',
		component: ResetPassword
	},
	{
		path: '/',
		name: 'Search',
		component: Search,
		children: [
			{
				path: '/settings',
				name: 'SearchSettings',
				component: SettingsView,
				props: true,
				meta: {
					showMoreSearchSettings: true
				  }
			}
		  ]
	},
	{
		path: '/search-result',
		name: 'SearchResult',
		component: SearchResult
	},
	{
		path: '/search-item',
		name: 'SearchItem',
		component: SearchItem
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
