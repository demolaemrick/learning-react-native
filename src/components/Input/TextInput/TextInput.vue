<template>
	<input-wrapper v-slot="{ errors, ariaInput }" v-bind="$props">
		<input
			:id="name"
			ref="input"
			v-model="innerValue"
			class="form-input"
			:class="{
				'form-input--error': errors && errors[0],
				'form__input--valid': hasValue
			}"
			:type="type"
			:placeholder="placeholder"
			v-bind="ariaInput"
			v-on="$listeners"
		/>
	</input-wrapper>
</template>

<script src="./TextInput.js"></script>
