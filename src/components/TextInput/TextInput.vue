<template>
	<input :id="name" ref="input" v-model="innerValue" class="form-input" :type="type" :placeholder="placeholder" v-on="$listeners" />
</template>

<script src="./TextInput.js"></script>
<style lang="scss" scoped>
.form-input {
	width: 240px;
	height: 46px;
	border-radius: 1px;
	border: solid 1px #ebebf2;
	padding: 0 16px;
	color: #333758;
	&::placeholder {
		color: #989aaa;
	}
	&:focus,
	&:focus-within {
		outline: none;
		background: #fff;
		border: solid 1px #5863f8;
	}
}
</style>
