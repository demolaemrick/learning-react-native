<template>
	<aside class="sidebar">
		<div class="sidebar__header">
			<span>
				<img src="@/assets/icons/volley-logo-white.svg" alt="" />
			</span>
		</div>
		<div class="sidebar__tabs">
			<ul>
				<router-link active-class="active" tag="li" class="single-tab" :to="{ name: 'Users' }" exact>
					<span class="single-tab__icon">
						<img src="@/assets/icons/user-menu.svg" alt="" />
					</span>
					Users
				</router-link>
				<router-link active-class="active" tag="li" class="single-tab" :to="{ name: 'Admin' }" exact>
					<span class="single-tab__icon">
						<img src="@/assets/icons/admin-menu.svg" alt="" />
					</span>
					Admin Management
				</router-link>
			</ul>
		</div>
		<!-- </div> -->
	</aside>
</template>

<script src="./SideBar.js"></script>

<style lang="scss" scoped>
@import './SideBar.scss';
</style>
