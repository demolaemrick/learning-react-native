import Vue from 'vue';
import { noAuthOnly, requireAuth } from '../utils/auth';
import VueRouter from 'vue-router';
import Search from '../views/Search/Search.vue';
import SearchResult from '../views/SearchResult/SearchResult.vue';
import SearchItem from '../views/SearchItem/SearchItem.vue';
import SettingsView from '../views/Settings/Settings.vue';
import ContactResearch from '../views/ContactResearch/ContactResearch.vue';
import Bookmarks from '../views/Bookmarks/Bookmarks.vue';

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
		component: Login,
		beforeEnter: noAuthOnly
	},
	{
		path: '/forgot-password',
		name: 'ForgotPassword',
		component: ForgotPassword,
		beforeEnter: noAuthOnly
	},
	{
		path: '/check-inbox',
		name: 'CheckInbox',
		component: CheckInbox,
		beforeEnter: noAuthOnly
	},
	{
		path: '/reset-password',
		name: 'ResetPassword',
		component: ResetPassword,
		beforeEnter: noAuthOnly
	},
	{
		path: '/',
		name: 'Search',
		component: Search,
		beforeEnter: requireAuth,
		children: [
			{
				path: '/settings',
				name: 'SearchSettings',
				component: SettingsView,
				props: true,
				meta: {
					showMoreSearchSettings: true
				}
			},
			{
				path: '/result',
				name: 'SearchResult',
				component: SearchResult
			},
			{
				path: '/result/item',
				name: 'SearchItem',
				component: SearchItem
			}
		]
	},
	// {
	// 	path: '/search-result',
	// 	name: 'SearchResult',
	// 	component: SearchResult
	// },
	// {
	// 	path: '/search-item',
	// 	name: 'SearchItem',
	// 	component: SearchItem
	// },
	{
		path: '/contact-research',
		name: 'ContactResearch',
		component: ContactResearch
	},
	{
		path: '/bookmarks',
		name: 'Bookmarks',
		component: Bookmarks
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
