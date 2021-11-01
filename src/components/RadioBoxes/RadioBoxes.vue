<template>
	<div class="article_wrapper">
		<label for="articletype">{{ inputName }}</label>
		<div class="radios_container">
			<div v-for="(data, index) in datas" :key="index" class="radio_box_row">
				<input
					:checked="resetChecked === data.value"
					@change="$emit('radiocheckUpdate', $event.target.value)"
					type="radio"
					:name="inputName"
					:value="data.value"
				/>
				<span>{{ data.name }}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'RadioBoxes',
	props: {
		inputName: {
			type: String,
			require: true
		},
		datas: {
			type: Array,
			default: () => []
		},
		resetChecked: {
			type: String,
			default: () => ''
		}
	},
	data() {
		return {
			checked: ''
		};
	}
};
</script>

<style lang="scss" scoped>
.article_wrapper {
	& > label {
		color: #989aaa;
		display: block;
		margin-bottom: 0.6rem;
	}
}
.radios_container {
	// display: flex;
	// align-items: center;
	& > *:not(:last-child) {
		margin-bottom: 1rem;
	}
}
.radio_box_row {
	display: flex;
	align-items: center;
	& > input {
		margin-right: 0.4rem;
	}
}
</style>
