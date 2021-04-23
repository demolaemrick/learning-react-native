<template>
	<header>
		<nav class="navbar">
			<div class="nav__back">
				<img class="icon" src="@/assets/icons/arrow-back.svg" svg-inline />
				<div class="text">Back to contact list</div>
			</div>
			<div class="nav__menu__right">
				<div class="search__icon__wrapper">
					<img src="@/assets/icons/search-icon.svg" svg-inline />
				</div>
				<div class="user__menu__wrapper">
					<v-toggle-dropdown class="user__dropdown__menu">
						<template #dropdown-wrapper>
							<img class="mr-1" src="@/assets/icons/user-icon.svg" svg-inline />
							<img src="@/assets/icons/carret-down.svg" svg-inline />
						</template>
						<template #dropdown-items>
							<li class="dropdown__item" @click="gotoSettings">
								Settings
							</li>
							<li class="dropdown__item" @click="logoutUser">
								Logout
							</li>
						</template>
					</v-toggle-dropdown>
				</div>
			</div>
		</nav>
	</header>
</template>

<script>
import VToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
	name: 'searchResultHeader',
	components: {
		VToggleDropdown
	},
	methods: {
		...mapMutations({
			logout: 'auth/logout'
		}),
		gotoSettings() {
			this.showMoreSearchSettings = !this.showMoreSearchSettings;
			this.$router.push('/settings');
		},
		logoutUser() {
			this.logout();
			this.$router.push('/login');
		}
	}
};
</script>

<style lang="scss" scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	padding: 1em;
	align-items: center;
	padding: 1em 3em;
	border-bottom: 1px solid #f2f2f2;
}
.nav__back {
	display: flex;
	align-items: center;
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
	.icon {
	}
}
.nav__menu__right {
	display: grid;
	grid-template-columns: 1fr 1fr;
	align-items: center;
}
</style>
