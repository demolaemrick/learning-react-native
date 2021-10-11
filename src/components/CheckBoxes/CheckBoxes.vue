<template>
	<div>
		<div v-for="(data, index) in datas" :key="index" class="check_box_row">
			<input
				@change="$emit('checkUpdate', checkDatas)"
				type="checkbox"
				:name="inputName"
				:value="data.value"
				v-model="checkDatas"
				:id="data.value"
			/>
			<span>{{ data.name }}</span>
		</div>
	</div>
</template>

<script src="./CheckBoxes.js"></script>
<style lang="scss" scoped src="./checkboxes.scss"></style>
