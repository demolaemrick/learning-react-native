<template>
	<div class="modal-overlay" @click="closeModal" :class="[!toggleClass ? 'fadeOut' : null]" >
		<div @click.stop="" class="modal-body" :style="style">
			<slot></slot>
		</div>
	</div>
</template>

<script src="./modal.js"></script>
<style lang="scss" scoped src="./modal.scss"></style>
