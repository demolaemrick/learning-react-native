<template>
	<div class="logo" @click="$router.push({ name: 'Search' })">
		<img class="logo-img" src="../assets/icons/volley_logo.png" svg-inline />
		<span v-if="platform">{{ platform }}</span>
	</div>
</template>

<script>
export default {
	props: { platform: { type: String } }
};
</script>

<style lang="scss" scoped>
.logo {
	cursor: pointer;
	&-img {
		height: 27px;
		width: 85px;
	}
	span {
		display: block;
		text-transform: capitalize;
		margin-top: 5px;
	}
}
</style>
