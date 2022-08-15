<template>
	<header>
		<nav class="navbar">
			<div class="nav-item logo">
				<logo />
			</div>
			<div v-if="notglobal" class="nav__menu__right">
				<img
					v-if="loggedInUser.status !== 'suspended'"
					class="search__icon__wrapper"
					@click="$router.push({ name: 'Search' })"
					src="@/assets/icons/search-icon.svg"
					svg-inline
				/>

				<div class="user__menu__wrapper">
					<v-toggle-dropdown class="user__dropdown__menu">
						<template #dropdown-wrapper>
							<img class="mr-1" src="@/assets/icons/user-icon.svg" svg-inline />
							<img src="@/assets/icons/carret-down.svg" svg-inline />
						</template>
						<template #dropdown-items>
							<li v-for="(dropdown, i) in dropdowns" :key="i">
								<p
									class="dropdown__item"
									v-if="dropdown.path && dropdown.for === 'all'"
									@click="$router.push({ path: dropdown.path })"
								>
									{{ dropdown.name }}
								</p>
								<p
									class="dropdown__item"
									v-else-if="
										loggedInUser.role !== 'user' && loggedInUser.status !== 'suspended' && dropdown.name === 'Dashboard'
									"
									@click="$router.push({ path: dropdown.path })"
								>
									{{ dropdown.name }}
								</p>
								<p
									class="dropdown__item"
									v-else-if="dropdown.path && loggedInUser.status !== 'suspended'"
									@click="$router.push({ path: dropdown.path })"
								>
									{{ dropdown.name }}
								</p>
								<p class="dropdown__item" v-if="dropdown.name === 'Logout'" @click="logoutUser">{{ dropdown.name }}</p>
							</li>
							<!-- <li
								v-if="loggedInUser.status !== 'suspended'"
								class="dropdown__item"
								@click="$router.push({ name: 'ApiPortal' })"
							>
								API Keys
							</li>
							<li class="dropdown__item" @click="goToBookmarks">Bookmarks</li>
							<li
								class="dropdown__item"
								v-if="loggedInUser.role !== 'user' && loggedInUser.status !== 'suspended'"
								@click="$router.push({ path: '/dashboard/users' })"
							>
								Dashboard
							</li>
							<li v-if="loggedInUser.status !== 'suspended'" class="dropdown__item" @click="gotoSettings">Settings</li>
							<li class="dropdown__item" @click="logoutUser">Logout</li> -->
						</template>
					</v-toggle-dropdown>
				</div>
			</div>
		</nav>
	</header>
</template>

<script>
import VToggleDropdown from '@/components/ToggleDropdown';
import Logo from '@/components/Logo';
import { mapMutations, mapGetters } from 'vuex';

export default {
	name: 'DataEnrichmentHeader',
	props: {
		notglobal: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			dropdowns: [
				{
					name: 'API Keys',
					path: '/api-portal',
					for: 'active'
				},
				{
					name: 'Bookmarks',
					path: '/bookmarks',
					for: 'all'
				},
				{
					name: 'Dashboard',
					path: '/dashboard/users',
					for: 'active'
				},
				{
					name: 'Settings',
					path: '/settings',
					for: 'active'
				},
				{
					name: 'Logout',
					path: '',
					for: 'all'
				}
			]
		};
	},
	components: {
		VToggleDropdown,
		Logo
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		})
	},
	methods: {
		...mapMutations({
			logout: 'auth/logout',
			setBookmarkValue: 'user/setBookmarkValue',
			saveSearchedResult: 'search_services/saveSearchedResult',
			setContactPageData: 'user/setContactPageData'
		}),
		gotoSettings() {
			// this.showMoreSearchSettings = !this.showMoreSearchSettings;
			this.$router.push('/settings');
		},
		goToBookmarks() {
			this.$router.push({ name: 'Bookmarks' });
			// this.setBookmarkValue('allBookmarks');
		},
		logoutUser() {
			const route = this.$router.currentRoute.fullPath;
			const email = this.loggedInUser.email;

			const substring = '/insights?id=';
			if (route.indexOf(substring) !== -1) {
				this.setLastSearchResult({ email, route });
				this.logout();
				this.$router.push('/login');
			} else {
				this.logout();
				this.setContactPageData(null);
				this.$router.push('/login');
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.navbar {
	margin: 32px 0 85px;
	display: block;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #f2f2f2;
}
.nav-item {
	&.logo {
		display: flex;
		align-items: center;
		&-text {
			line-height: 1.25;
			letter-spacing: -0.57px;
			font-size: 24px;
		}
	}
}
.nav__menu__right {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.search__icon__wrapper {
		margin-right: 25px;
		cursor: pointer;
	}
	.user__menu__wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 5px;
		.user__dropdown__menu {
			.dropdown__list-wrapper {
				top: 100%;
			}
		}
	}
}
</style>
