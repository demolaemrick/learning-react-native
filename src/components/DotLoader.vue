<template>
	<div class="dot__wrapper">
		<div class="dot-falling"></div>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
.dot__wrapper {
	display: flex;
	justify-content: center;
	padding: 10px 0;
}
.dot-falling {
	position: relative;
	left: -9999px;
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: #3b48f7;
	color: #3b48f7;
	box-shadow: 9999px 0 0 0 #3b48f7;
	animation: dotFalling 1s infinite linear;
	animation-delay: 0.1s;
}

.dot-falling::before,
.dot-falling::after {
	content: '';
	display: inline-block;
	position: absolute;
	top: 0;
}

.dot-falling::before {
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: #3b48f7;
	color: #3b48f7;
	animation: dotFallingBefore 1s infinite linear;
	animation-delay: 0s;
}

.dot-falling::after {
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: #3b48f7;
	color: #3b48f7;
	animation: dotFallingAfter 1s infinite linear;
	animation-delay: 0.2s;
}

@keyframes dotFalling {
	0% {
		box-shadow: 9999px -15px 0 0 rgba(59, 72, 247, 0);
	}
	25%,
	50%,
	75% {
		box-shadow: 9999px 0 0 0 #3b48f7;
	}
	100% {
		box-shadow: 9999px 15px 0 0 rgba(59, 72, 247, 0);
	}
}

@keyframes dotFallingBefore {
	0% {
		box-shadow: 9984px -15px 0 0 rgba(152, 128, 255, 0);
	}
	25%,
	50%,
	75% {
		box-shadow: 9984px 0 0 0 #3b48f7;
	}
	100% {
		box-shadow: 9984px 15px 0 0 rgba(152, 128, 255, 0);
	}
}

@keyframes dotFallingAfter {
	0% {
		box-shadow: 10014px -15px 0 0 rgba(152, 128, 255, 0);
	}
	25%,
	50%,
	75% {
		box-shadow: 10014px 0 0 0 #3b48f7;
	}
	100% {
		box-shadow: 10014px 15px 0 0 rgba(152, 128, 255, 0);
	}
}
</style>
