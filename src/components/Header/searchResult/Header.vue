<template>
	<header>
		<nav class="navbar">
			<div class="nav-item logo">
			<img src="@/assets/icons/arrow-back.svg" svg-inline />
			<div>Back to contact list</div>
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
							<li class="dropdown__item">
								Settings
							</li>
							<li class="dropdown__item">
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
export default {
	name: 'searchResultHeader'
}
</script>