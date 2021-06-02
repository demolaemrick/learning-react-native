<template>
	<!-- <div><p>tester</p></div> -->
	<div class="dashboard-header">
		<div class="user-details">
			<h4 class="user-details__name">Brown Ideye</h4>
			<h4 class="user-details__role">Super Admin</h4>
		</div>
		<div class="topCircle">
			<p class="user__initials">BI</p>
		</div>
		<div class="arrow">
			<toggle-dropdown itemPadding="0">
				<template #dropdown-wrapper>
					<div>
						<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
					</div>
				</template>
				<template #dropdown-items>
					<li class="dropdown__item">
						Log out
					</li>
				</template>
			</toggle-dropdown>
		</div>
	</div>
</template>

<script src="./DashboardHeader.js"></script>

<style lang="scss" scoped>
@import './DashboardHeader.scss';
</style>
