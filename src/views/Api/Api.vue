<template>
	<div class="dashboard-wrapper">
		<home-header />
		<div class="page-content">
			<h3 class="page-content__name">API Keys</h3>
			<div class="page-content__body">
				<h4 class="form-head">
					Integration
				</h4>

				<div class="form-body">
					<p class="label">API key</p>
					<div class="key-section">
						<div class="key-group">
							<p class="key-group__text">ps://www.flaticon.com/free-icon/market_2230606</p>
						</div>
						<div class="btn">Copy</div>
					</div>
					<button class="key-generate" @click="generateKey">Generate key</button>
				</div>

				<div class="form-body">
					<p class="label">Test key</p>
					<div class="key-section">
						<div class="key-group">
							<p class="key-group__text">ps://www.flaticon.com/free-icon/market_2230606</p>
						</div>
						<div class="btn">Copy</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import HomeHeader from '@/components/Header/home/Header';
import { mapActions } from 'vuex';

export default {
	name: 'Api',
	data() {
		return {
			keys: []
		};
	},
	components: {
		HomeHeader
	},
	async mounted() {
		try {
			const response = await this.fetchApiKeys();
			const { status, statusText, data } = response;
			if (status === 200 && statusText === 'OK') {
				console.log('Hello there');
				this.keys = data.keys;
				console.log(this.keys);

				this.showAlert({
					status: 'success',
					message: 'Api Keys retrieved successfully',
					showAlert: true
				});
			}
		} catch (error) {
			this.showAlert({
				status: 'error',
				message: 'Unable to retrieve Api keys',
				showAlert: true
			});
		}
	},
	methods: {
		...mapActions({
			fetchApiKeys: 'user/fetchApiKeys',
			showAlert: 'showAlert'
		}),

		async generateKey() {
			console.log('key generated');
			// console.log(this.$store.getters['auth/getLoggedUser'].id);
			try {
				const response = await this.fetchApiKeys();
				const { status, statusText, data } = response;
				console.log(data);
				if (status === 200 && statusText === 'OK') {
					this.keys = data.keys;
					console.log(this.keys);

					this.showAlert({
						status: 'success',
						message: 'Api Keys retrieved successfully',
						showAlert: true
					});
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: 'Unable to retrieve Api keys',
					showAlert: true
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.dashboard-body {
	margin-left: 248px;
	background-color: #ffffff;
	padding: 16px 32px;
	min-height: 100vh;
}
.dashboard-wrapper {
	min-height: 100vh;
}
.page-content {
	margin: 3.8% 18%;

	&__name {
		font-size: 24px;
		line-height: 28px;
		letter-spacing: -0.64px;
		color: #333758;
		margin-bottom: 24px;
	}

	&__body {
		border: 1px solid #f4f5f6;
		border-radius: 4px;
		padding: 24px 32px 84px;
	}
	.form-head {
		padding-bottom: 16px;
		border-bottom: 1px solid #d7dce0;
	}
	.form-body {
		padding-top: 24px;

		.label,
		.key-generate {
			font-size: 14px;
			line-height: 16px;
			color: #989aaa;
			font-size: 14px;
		}
		.key-generate {
			color: #3b48f7;
			margin-top: 8px;
			transition: color 0.3s ease-in-out;

			&:hover {
				color: #333758;
				color: red;
				display: inline-block;
			}
		}

		.key-section {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 8px;
		}
		.key-group {
			padding: 16px;
			border: 1px solid #d7dce0;
			border-radius: 4px 0 0 4px;
			flex-grow: 1;
			border-right: 0;
			box-sizing: border-box;
			line-height: 14px;

			&__text {
				font-size: 16px;
			}
		}
		.btn {
			background: #ebedfe;
			border-radius: 0 4px 4px 0;
			padding: 16px 24px;
			font-size: 16px;
			line-height: 1;
			color: #3b48f7;
			cursor: pointer;
		}
	}
}
</style>
