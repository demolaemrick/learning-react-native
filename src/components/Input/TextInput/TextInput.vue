<template>
	<input-wrapper v-slot="{ errors, ariaInput }" v-bind="$props">
		<label :class="{ 'form-label--hide': !labelVisible }" :for="name" class="form-label"
			>{{ name }} <span v-if="rules === 'required'" class="required">*</span></label
		>
		<input
			:id="name"
			ref="input"
			v-model="innerValue"
			class="form-input"
			:style="style"
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
