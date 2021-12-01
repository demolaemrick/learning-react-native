<template>
	<header class="header">
		<nav :class="{ navbar: !isFromAdmin, navbar_admin: isFromAdmin }">
			<div class="nav__back" @click="[$router.go(-1), $forceUpdate()]">
				<img class="icon" src="@/assets/icons/arrow-back.svg" svg-inline />
				<div class="text">Back to previous page</div>
			</div>
			<div class="nav__menu__right" v-if="!isFromAdmin">
				<div class="research" @click="$router.push({ name: 'ContactResearch' })">Contact List</div>
				<img
					v-if="loggedInUser.status !== 'suspended'"
					class="search__icon__wrapper"
					src="@/assets/icons/search-icon.svg"
					@click="$router.push({ name: 'Search' })"
					svg-inline
				/>
				<div class="user__menu__wrapper">
					<v-toggle-dropdown class="user__dropdown__menu">
						<template #dropdown-wrapper>
							<img class="mr-1" src="@/assets/icons/user-icon.svg" svg-inline />
							<img src="@/assets/icons/carret-down.svg" svg-inline />
						</template>
						<template #dropdown-items>
							<ul>
								<li
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
								<li class="dropdown__item" @click="logoutUser">Logout</li>
							</ul>
						</template>
					</v-toggle-dropdown>
				</div>
			</div>
		</nav>
	</header>
</template>

<script>
import VToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters } from 'vuex';

export default {
	name: 'searchResultHeader',
	props: ['isFromAdmin'],
	components: {
		VToggleDropdown
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		})
	},
	methods: {
		...mapMutations({
			logout: 'auth/logout',
			setLastSearchResult: 'auth/setLastSearchResult',
			setBookmarkValue: 'user/setBookmarkValue',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		gotoSettings() {
			this.showMoreSearchSettings = !this.showMoreSearchSettings;
			this.$router.push('/settings');
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
				this.$router.push('/login');
			}
		},
		goToBookmarks() {
			this.$router.push({ name: 'Bookmarks' });
			this.setBookmarkValue('allBookmarks');
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.header {
	position: sticky;
	top: 0;
	z-index: 2;
	background-color: #fff;
}
.navbar {
	display: flex;
	justify-content: space-between;
	padding: 1em;
	align-items: center;
	padding: 1em 3em;
	border-bottom: 1px solid #f2f2f2;
}
.navbar_admin {
	@extend .navbar;
	padding: 1em 0 1.5rem;
	transform: translateY(-1rem);
}
.nav__back {
	display: flex;
	align-items: center;
	cursor: pointer;
	.text {
		margin-left: 0.5em;
		font-family: Karla;
		font-style: normal;
		font-weight: normal;
		font-size: 15px;
		line-height: 18px;
		letter-spacing: -0.117188px;
		color: #394141;
	}
}
.nav__menu__right {
	display: flex;
	align-items: center;
	.search__icon__wrapper {
		margin-right: 25px;
		cursor: pointer;
	}
}
.research {
	margin-right: 15px;
	cursor: pointer;
}
@include query(mobile, max) {
	.navbar {
		padding: 1em 2em;
	}
}
</style>
