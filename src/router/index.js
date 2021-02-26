import Vue from 'vue';
import VueRouter from 'vue-router';
import Search from '../views/Search/Search.vue';
import SearchResult from '../views/SearchResult/SearchResult.vue';
import SearchItem from '../views/SearchItem/SearchItem.vue';
Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Search',
		component: Search
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
