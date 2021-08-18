<template>
	<div class="dashboard-wrapper">
		<home-header />
		<div class="loader" v-if="pageLoading">
			<img src="@/assets/icons/page-loader.svg" alt="" />
		</div>
		<div v-else-if="!keys.length" class="page-wrapper">
			<img src="@/assets/icons/api-generate.svg" alt="" />
			<div class="text">
				<h2 class="text-main">Get an API Key</h2>
				<p class="text-sub">Click on the button to generate an API key</p>
			</div>
			<v-button class="config__btn__close" @click="getKey">
				<div class="btn__content__wrapper">
					<Loader v-if="loading" />
					<span v-else class="text">Generate API Key</span>
				</div>
			</v-button>
			<!-- <v-button class="submit" size="large" buttonType="primary">Generate API Key</v-button> -->
		</div>
		<div v-else class="page-content">
			<h3 class="page-content__name">API Keys</h3>
			<div class="page-content__body">
				<h4 class="form-head">
					Integration
				</h4>

				<!-- <div v-if="!keys.length">
					<div class="form-body">
						<p class="label">API key</p>
						<div class="key-section">
							<div class="key-group">
								<p class="key-group__text">ps://www.flaticon.com/free-icon/market_2230606</p>
							</div>
							<div class="btn">Copy</div>
						</div>
						<button class="key-generate" @click="getKey">Generate key</button>
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
				</div> -->

				<template>
					<div v-for="(api, index) in keys" :key="index">
						<div class="form-body">
							<p class="label">API {{ api.mode }} key</p>
							<div class="key-section">
								<div class="key-group">
									<p v-if="index === 0" class="key-group__text" ref="liveKey">{{ api.key }}</p>
									<p v-if="index === 1" class="key-group__text" ref="testKey">{{ api.key }}</p>
								</div>
								<div v-if="index === 0" class="btn" ref="liveBtn" @click="copyLiveKey">Copy</div>
								<div v-if="index === 1" class="btn" ref="testBtn" @click="copyTestKey">Copy</div>
							</div>
							<button v-if="index === 0" class="key-generate" @click="getKey">Regenerate key</button>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import HomeHeader from '@/components/Header/home/Header';
import { mapActions } from 'vuex';
import VButton from '@/components/Button';
import Loader from '@/components/Loader';

export default {
	name: 'Api',
	data() {
		return {
			keys: [],
			loading: false,
			pageLoading: true
		};
	},
	components: {
		HomeHeader,
		VButton,
		Loader
	},
	async mounted() {
		try {
			const response = await this.fetchApiKeys();
			const { status, statusText, data } = response;
			console.log(data.keys);
			console.log(data.keys.length);

			if (status === 200 && statusText === 'OK' && data.keys.length) {
				console.log('data not empty -->', data.keys);
				this.keys = data.keys[0];
				console.log(this.keys);
				this.showAlert({
					status: 'success',
					message: 'Api Keys retrieved successfully',
					showAlert: true
				});
			} else {
				this.showAlert({
					status: 'info',
					message: 'No Api Keys available. Kindly generate one',
					showAlert: true
				});
			}
		} catch (error) {
			this.showAlert({
				status: 'error',
				message: 'Unable to retrieve Api keys',
				showAlert: true
			});
		} finally {
			this.pageLoading = false;
		}
	},
	methods: {
		...mapActions({
			fetchApiKeys: 'user/fetchApiKeys',
			generateApiKey: 'user/generateApiKey',
			regenerateApiKey: 'user/regenerateApiKey',
			showAlert: 'showAlert'
		}),

		async getKey() {
			this.loading = true;
			console.log(this.keys);

			if (!this.keys.length) {
				this.generateKeys();
			} else {
				console.log('These keys exist', this.keys);
				this.regenerateKeys();
			}
		},
		async generateKeys() {
			console.log('no existing key');
			// try {
			// 	const response = await this.generateApiKey();
			// 	const { status, statusText, data } = response;
			// 	if (status === 200 && statusText === 'OK') {
			// 		this.keys = data.keys[0];
			// 		console.log('generate -->', data.keys);

			// 		this.showAlert({
			// 			status: 'success',
			// 			message: 'Api Keys regenerated successfully',
			// 			showAlert: true
			// 		});
			// 	}
			// } catch (error) {
			// 	this.showAlert({
			// 		status: 'error',
			// 		message: 'Unable to regenerate Api keys',
			// 		showAlert: true
			// 	});
			// }
			this.loading = false;
		},
		async regenerateKeys() {
			console.log('keys exist');
			const array = this.keys;
			const id = array[0].keyId;
			try {
				const response = await this.regenerateApiKey({ id });
				console.log(response);
				const { status, statusText, data } = response;
				if (status === 200 && statusText === 'OK') {
					this.keys = data.keys;
					console.log('reeegenerate -->', data.keys);

					this.showAlert({
						status: 'success',
						message: 'Api Keys regenerated successfully',
						showAlert: true
					});
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: 'Unable to regenerate Api keys',
					showAlert: true
				});
			}
		},
		copyLiveKey() {
			const liveKey = this.$refs.liveKey[0].textContent;
			const btn = this.$refs.liveBtn[0];
			this.copyKey(liveKey, btn);
		},

		copyTestKey() {
			const testKey = this.$refs.testKey[0].textContent;
			const btn = this.$refs.testBtn[0];
			this.copyKey(testKey, btn);
		},

		copyKey(selectedKey, copyBtn) {
			if (selectedKey) {
				navigator.clipboard
					.writeText(selectedKey)
					.then(() => {
						if (copyBtn.innerText !== 'Copied!') {
							const originalText = copyBtn.innerText;
							copyBtn.innerText = 'Copied!';
							setTimeout(() => {
								copyBtn.innerText = originalText;
							}, 1500);
						}
						this.showAlert({
							status: 'success',
							message: 'Api Key copied',
							showAlert: true
						});
					})
					.catch(() => {
						this.showAlert({
							status: 'error',
							message: 'Unable to copy Api key',
							showAlert: true
						});
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
.page-wrapper {
	text-align: center;
	margin-top: 9%;
}
.loader {
	display: grid;
	place-items: center;
	min-height: 80vh;
}
.text {
	margin-top: 60px;
	margin-bottom: 32px;

	&-main {
		font-size: 32px;
		line-height: 32px;
		letter-spacing: -0.008em;
		color: #333758;
		margin-bottom: 12px;
	}

	&-sub {
		font-size: 16px;
		line-height: 24px;
		letter-spacing: -0.002em;
		color: #202f44;
	}
}
</style>
