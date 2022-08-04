import Vue from 'vue';
import { noAuthOnly, emailGenerationAuth, requireUserAuth, requireAdminAuth } from '../utils/auth';
import VueRouter from 'vue-router';
import Search from '../views/Search/Search.vue';
import Insights from '../views/Insights/Insights.vue';
import InsightItem from '../views/InsightItem/InsightItem.vue';
import EmailHook from '../views/EmailHook/EmailHook.vue';
import SettingsView from '../views/Settings/Settings.vue';
import ContactResearch from '../views/ContactResearch/ContactResearch.vue';
import Bookmarks from '../views/Bookmarks/Bookmarks.vue';

const NotFound = () => import(/* webpackChunkName: 'NotFound' */ '../views/NotFound.vue');
const ChromeExt = () => import(/* webpackChunkName: 'NotFound' */ '../views/ChromeExt.vue');
const PrivacyPolicy = () => import(/* webpackChunkName: 'NotFound' */ '../views/PrivacyPolicy/index.vue');
const Login = () => import(/* webpackChunkName: 'login' */ '../views/auth/Login');
const ForgotPassword = () => import(/* webpackChunkName: 'ForgotPassword' */ '../views/auth/ForgotPassword');
const CheckInbox = () => import(/* webpackChunkName: 'CheckInbox' */ '../views/auth/ForgotPassword/CheckInbox');
const ResetPassword = () => import(/* webpackChunkName: 'ResetPassword' */ '../views/auth/ResetPassword');
const AdminInvite = () => import(/* webpackChunkName: 'AdminInvite' */ '../views/auth/AdminInvite');
const Dashboard = () => import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard/Index.vue');
const Admin = () => import(/* webpackChunkName: 'Admin' */ '../views/Dashboard/Admin');
const Users = () => import(/* webpackChunkName: 'Users' */ '../views/Dashboard/Users');
const User = () => import(/* webpackChunkName: 'User' */ '../views/Dashboard/User');
const Api = () => import(/* webpackChunkName: 'ApiPortal' */ '../views/ApiPortal');
const ChoosePlatform = () => import(/* webpackChunkName: 'ChoosePlatform' */ '../views/ChoosePlatform');
const DataPlatform = () => import(/* webpackChunkName: 'DataPlatform' */ '../views/DataPlatform');

Vue.use(VueRouter);

const routes = [
	{
		path: '*',
		name: 'not-found',
		component: NotFound
	},
	{
		path: '/dashboard',
		component: Dashboard,
		beforeEnter: requireAdminAuth,
		children: [
			{
				path: '',
				name: 'Admin',
				component: Admin
			},
			{
				path: 'users',
				name: 'Users',
				component: Users
			},
			{
				path: 'user/:userId?',
				name: 'User',
				component: User,
				meta: 'user'
			},
			{
				path: 'insights',
				name: 'AdminInsights',
				component: Insights
			},
			{
				path: 'insight-item',
				name: 'AdminInsightItem',
				component: InsightItem
			}
		]
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
		path: '/admin/invite',
		name: 'AdminInvite',
		component: AdminInvite,
		beforeEnter: noAuthOnly
	},
	{
		path: '/',
		name: 'Search',
		component: Search,
		beforeEnter: requireUserAuth,
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
		path: '/chrome-ext',
		name: 'ChromeExte',
		component: ChromeExt
	},
	{
		path: '/privacy-policy',
		name: 'PrivacyPolicy',
		component: PrivacyPolicy
	},
	{
		path: '/insights',
		name: 'Insights',
		component: Insights,
		beforeEnter: requireUserAuth
	},
	{
		path: '/insight-item',
		name: 'InsightItem',
		component: InsightItem,
		beforeEnter: requireUserAuth
	},
	{
		path: '/email-hook',
		name: 'EmailHook',
		component: EmailHook,
		beforeEnter: emailGenerationAuth
	},
	{
		path: '/contact-research',
		name: 'ContactResearch',
		component: ContactResearch,
		beforeEnter: requireUserAuth
	},
	{
		path: '/bookmarks/:rowId?',
		name: 'Bookmarks',
		component: Bookmarks,
		beforeEnter: requireUserAuth
	},
	{
		path: '/api-portal',
		name: 'ApiPortal',
		component: Api,
		beforeEnter: requireUserAuth
	},
	{
		path: '/choose-platform',
		name: 'ChoosePlatform',
		component: ChoosePlatform,
		beforeEnter: requireUserAuth
	},
	{
		path: '/data-platform',
		name: 'DataPlatform',
		component: DataPlatform,
		beforeEnter: requireUserAuth
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	linkActiveClass: 'active'
});

export default router;
