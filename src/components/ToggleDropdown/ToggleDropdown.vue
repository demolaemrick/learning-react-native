<template>
	<div class="u-relative">
		<span class="dropdown__wrapper" @click="showDropdown = !showDropdown">
			<slot name="dropdown-wrapper"></slot>
		</span>
		<div class="dropdown__list-wrapper" v-if="showDropdown">
			<ul id="dropdown-list" tabindex="-1" class="dropdown__list">
				<slot name="dropdown-items"></slot>
			</ul>
		</div>
	</div>
</template>

<script src="./toggle-dropdown.js"></script>

<style lang="scss" src="./toggle-dropdown.scss"></style>
