<template>
	<button type="button" class="btn btn-primary" v-on="$listeners">
		<slot />
		<slot name="icon" />
	</button>
</template>

<script src="./button.js"></script>
<style lang="scss" scoped>
@import '../../assets/scss/main.scss';
.btn {
	height: 46px;
	padding: 0 58px;
	border-radius: 1px;
	cursor: pointer;
	&.btn-primary {
		background: #3b48f7;
		color: #fff;
	}
	&[disabled] {
		color: grey;
		border: none;
		background-color: #f5f5f5;
	}
}
@include query(mobile, max) {
	.btn {
		width: 100%;
	}
}
</style>
