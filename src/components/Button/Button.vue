<template>
	<button type="button" :class="classes" class="btn-primary" v-on="$listeners">
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
	border-radius: 2px;
	cursor: pointer;
	&-primary {
		background: #3b48f7;
		color: #fff;
	}
	&-secondary {
		background: rgba(59, 72, 247, 0.08);
		color: #3b48f7;
	}
	&-warning {
		background: #ca1b1b;
		color: #fff;
	}
	&[disabled] {
		color: grey;
		border: none;
		background-color: #f5f5f5;
	}
	&-small {
		padding: 0 20px;
		width: initial !important;
	}
	&-full {
		width: 100%;
		text-align: center;
	}
	&-modal {
		width: 100px;
		height: 40px;
		text-align: center;
		border-radius: 4px;
		padding: 0;
	}
}
@include query(mobile, max) {
	.btn {
		width: 100%;
	}
}
</style>
