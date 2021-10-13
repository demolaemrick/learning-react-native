<template>
	<div class="dashboard-wrapper">
		<SideBar :activeside="activeSide" />
		<div class="dashboard-body" :class="{ active: activeSide }">
			<MainHeader :toggleActive="toggleActive" />
			<router-view />
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
			console.log('here');
			this.activeSide = !this.activeSide;
			this.$emit('toggleSide');
		}
	}
};
</script>

<style scoped>
.dashboard-body {
	background-color: #ffffff;
	padding: 16px;
	width: 100vw;
	overflow: auto;
}

.dashboard-body.active {
	width: 80vw;
	margin: 0 0 0 auto;
}
</style>
