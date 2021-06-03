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
const Dashboard = () => import(/* webpackChunkName: 'login' */ '../views/Dashboard/Index.vue');
const Admin = () => import(/* webpackChunkName: 'login' */ '../views/Dashboard/Admin');
const Users = () => import(/* webpackChunkName: 'login' */ '../views/Dashboard/Users');
const User = () => import(/* webpackChunkName: 'login' */ '../views/Dashboard/User');

Vue.use(VueRouter);

{
	/* <router-link :to="{ name: 'User', params: { id: data.id } }"></router-link> */
}

const routes = [
	{
		path: '*',
		name: 'not-found',
		component: NotFound
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard,
		children: [
			{
				path: 'admin',
				name: 'Admin',
				component: Admin
			},
			{
				path: 'users',
				name: 'Users',
				component: Users
			},
			{
				path: 'users/:id',
				name: 'User',
				component: User
			},
			// {
			// 	path: 'users/:id',
			// 	name: 'User',
			// 	component: User
			// },
			{
				path: '',
				redirect: 'users'
			}
		]
		// beforeEnter: noAuthOnly
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
			}
		]
	},
	{
		path: '/search-result/:rowId?',
		name: 'SearchResult',
		component: SearchResult,
		beforeEnter: requireAuth
	},
	{
		path: '/search-item',
		name: 'SearchItem',
		component: SearchItem,
		beforeEnter: requireAuth
	},
	{
		path: '/contact-research',
		name: 'ContactResearch',
		component: ContactResearch,
		beforeEnter: requireAuth
	},
	{
		path: '/bookmarks/:rowId?',
		name: 'Bookmarks',
		component: Bookmarks,
		beforeEnter: requireAuth
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	linkActiveClass: 'active'
});

export default router;
