<template>
	<div class="dashboard-header">
		<div class="user-details">
			<h4 class="user-details__name">Brown Ideye</h4>
			<h4 class="user-details__role">Super Admin</h4>
		</div>
		<div>
			<toggle-dropdown itemPadding="0">
				<template #dropdown-wrapper>
					<div class="flex flex__item-center">
						<div class="topCircle">
							<p class="user__initials">BI</p>
						</div>
						<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
					</div>
				</template>
				<template #dropdown-items>
					<li id="logout" class="dropdown__item" @click="logoutUser">Log out</li>
				</template>
			</toggle-dropdown>
		</div>
	</div>
</template>

<script src="./DashboardHeader.js"></script>

<style lang="scss" scoped>
@import './DashboardHeader.scss';
</style>
