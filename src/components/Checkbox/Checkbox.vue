<template>
	<div class="checkbox" :class="{ checked: innerValue }">
		<input
			:id="name"
			v-model="innerValue"
			type="checkbox"
			:name="name"
			:value="truthValue"
			v-on="$listeners"
			:disabled="disabled"
			:checked="checked"
		/>
		<label :for="name">
			<slot />
		</label>
	</div>
</template>

<script src="./Checkbox.js"></script>
<style lang="scss" scoped src="./Checkbox.scss"></style>
