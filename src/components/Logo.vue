<template>
	<div class="logo" @click="$router.push({ name: 'Search' })">
		<img class="logo-img" src="../assets/icons/volley_logo.png" svg-inline />
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.logo {
	display: flex;
	align-items: center;
	cursor: pointer;
	&-img {
		height: 27px;
		width: 85px;
	}
}
</style>
