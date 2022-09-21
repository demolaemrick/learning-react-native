<template>
	<div class="dashboard-wrapper">
		<SideBar :activeside="activeSide" />
		<div class="dashboard-body" :class="{ active: activeSide }">
			<MainHeader :toggleActive="toggleActive" />
			<router-view @closeSideMenu="closeSideMenuF" />
		</div>
	</div>
</template>

<script>
import SideBar from '@/components/SideBar';
import MainHeader from '@/components/DashboardHeader';

export default {
	name: 'Dashboard',
	components: {
		SideBar,
		MainHeader
	},
	data() {
		return {
			activeSide: true
		};
	},
	methods: {
		toggleActive() {
			this.activeSide = !this.activeSide;
			this.$emit('toggleSide');
		},
		closeSideMenuF() {
			this.activeSide = false;
		},
		openSideMenu() {
			this.activeSide = true;
		}
	}
};
</script>

<style scoped>
.dashboard-body {
	background-color: #ffffff;
	padding: 16px;
	width: 100vw;
	margin: 0 auto;
	transition: all 0.3s ease-in-out;
}
@media (min-width: 1024px) {
	.dashboard-body.active {
		width: 76vw;
		margin: 0 0 0 auto;
	}
}
@media (min-width: 1160px) {
	.dashboard-body.active {
		width: 78vw;
		margin: 0 0 0 auto;
	}
}

@media (min-width: 1400px) {
	.dashboard-body.active {
		width: 82vw;
		margin: 0 0 0 auto;
	}
}
</style>
