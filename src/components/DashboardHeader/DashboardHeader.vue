<template>
	<div class="dashboard-header">
		<button class="toggleBtn" @click="toggleActive()">
			<span></span>
			<span></span>
			<span></span>
		</button>
		<div>
			<div class="user-details">
				<h4 class="user-details__name">{{ `${loggedInUser.first_name} ${loggedInUser.last_name}` }}</h4>
				<h4 class="user-details__role">{{ loggedInUser.role }}</h4>
			</div>
			<div>
				<toggle-dropdown itemPadding="0">
					<template #dropdown-wrapper>
						<div class="flex flex__item-center">
							<div class="topCircle">
								<p class="user__initials" v-if="loggedInUser.first_name">
									{{ loggedInUser.first_name.charAt(0).toUpperCase() }}{{ loggedInUser.last_name.charAt(0).toUpperCase() }}
								</p>
							</div>
							<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="drop down arrow" svg-inline />
						</div>
					</template>
					<template #dropdown-items>
						<li class="dropdown__item" @click="$router.push({ name: 'ContactResearch' })">Contacts</li>
						<li id="logout" class="dropdown__item" @click="logoutUser">Log out</li>
					</template>
				</toggle-dropdown>
			</div>
		</div>
	</div>
</template>

<script src="./DashboardHeader.js"></script>

<style lang="scss" scoped>
@import './DashboardHeader.scss';

.toggleBtn {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 2px 3px;
	overflow: hidden;
	width: 35px;
	height: 35px;
	border-radius: 10vh;

	& > span {
		display: block;
		height: 2px;
		width: 100%;
		background-color: #162a56;
		opacity: 0.7;
		border-radius: 20%;
		&:not(:last-child) {
			margin-bottom: 4px;
		}
	}
}
</style>
