<template>
	<div>
		<v-frame @click="optionsVisible = false" @focus="handleOutsideFocus">
			<div class="select" @focus.capture="handleFocus">
				<fieldset class="select__fieldset">
					<legend class="select__legend">
						<v-text-input
							placeholder="Company"
							name="company"
							v-bind="$props"
							rules="required"
							@blur="clearFilter"
							@keyup="filterOptions"
							v-model="valueString"
						/>
					</legend>
					<div v-if="filteredOptions.length" class="select__options" :class="{ 'u-visually-hidden': !optionsVisible }">
						<div v-for="option in filteredOptions" :key="option.label || option" class="select__option">
							<input
								:id="option.label || option"
								v-model="localValue"
								type="radio"
								:name="option.label || option"
								:value="option.value || option"
							/>
							<label :for="option.label || option">
								{{ option.label || option }}
							</label>
						</div>
					</div>
				</fieldset>
			</div>
		</v-frame>
	</div>
</template>

<script src="./Select.js"></script>

<style lang="scss" scoped src="./Select.scss"></style>
