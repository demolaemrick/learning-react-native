<template>
	<input-wrapper v-slot="{ errors, ariaInput }" v-bind="$props">
		<label :class="{ 'form-label--hide': !labelVisible }" :for="name" class="form-label"
			>{{ name }} <span v-if="rules === 'required'" class="required">*</span></label
		>
		<div class="u-relative" :style="style">
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
			<div class="form-icon" v-if="icon.type">
				<img v-if="icon.type === 'search'" src="../../../assets/icons/search-icon.svg" alt="" />
				<img v-if="icon.type === 'date'" src="../../../assets/icons/date-icon.svg" alt="" />
			</div>
		</div>
	</input-wrapper>
</template>

<script src="./TextInput.js"></script>
