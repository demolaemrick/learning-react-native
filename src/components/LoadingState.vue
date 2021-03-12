<template>
	<div class="page__loading">
		<div class="page__loading-row">
			<div class="page__loading-left">
				<div class=" mb-1 loading-bottom"></div>
				<div class=" mb-1 loading-bottom"></div>
				<div class=" mb-1 loading-bottom"></div>
				<div class=" mb-1 loading-bottom"></div>
				<div class=" mb-1 loading-bottom"></div>
				<div class=" mb-1 loading-bottom"></div>
				<div class=" mb-1 loading-bottom"></div>
				<div class=" mb-1 loading-bottom"></div>
			</div>
		</div>
		<!-- <div class="page__loading-bottom">
			<div class="first"></div>
			<div class="second"></div>
			<div class="third"></div>
		</div> -->
	</div>
</template>
<script>
export default {
	name: 'LoadingState'
};
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.page__loading {
	&-row {
		@include flex;
		justify-content: space-between;
		align-self: center;
		margin: 64px 0 32px;
	}
	.loading-top,
	.loading-bottom {
		background: linear-gradient(90deg, #f8f9fb, #e2e6f3, #f8f9fb, #e2e6f3);
		animation: skeleton 2s ease infinite;
		background-size: 300% 100%;
	}
	&-left {
		.loading-top {
			// width: 136px;
			height: 24px;
		}
		.loading-bottom {
			width: 486px;
			height: 12px;
			@include query(tablet) {
				width: 346px;
			}
			@include query(mobile) {
				width: 246px;
			}
		}
	}
	&-right {
		@include flexcol;
		justify-content: space-between;
		align-items: flex-end;
		@include query(tablet) {
			display: none;
		}
		.loading-top {
			width: 240px;
			height: 12px;
		}
		.loading-bottom {
			height: 12px;
			width: 140px;
		}
	}
	&-bottom {
		display: flex;
		.first,
		.second,
		.third {
			background: linear-gradient(90deg, #f8f9fb, #e2e6f3, #f8f9fb, #e2e6f3);
			animation: skeleton 2s ease infinite;
			background-size: 300% 100%;
			height: 40px;
		}
		.first {
			width: 271px;
		}
		.second {
			width: 161px;
			margin: 0 12px;
		}
		.third {
			width: 174px;
		}
	}
}
@-webkit-keyframes skeleton {
	0% {
		background-position: 100% 0;
	}

	100% {
		background-position: 0 0;
	}
}
@keyframes skeleton {
	0% {
		background-position: 100% 0;
	}

	100% {
		background-position: 0 0;
	}
}
</style>
