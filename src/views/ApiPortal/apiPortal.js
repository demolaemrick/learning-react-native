import HomeHeader from '@/components/Header/home/Header';
import { mapActions } from 'vuex';
import VButton from '@/components/Button';
import Loader from '@/components/Loader';

export default {
	name: 'ApiPortal',
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

			if (status === 200 && statusText === 'OK' && data.keys.length) {
				this.keys = data.keys[0];
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

			if (!this.keys.length) {
				console.log('These keys never generated', this.keys);
				this.generateKeys();
			} else {
				console.log('These keys exist', this.keys);
				this.regenerateKeys();
			}
		},
		async generateKeys() {
			try {
				const response = await this.generateApiKey();
				const { status, statusText, data } = response;
				if (status === 200 && statusText === 'OK') {
					this.keys = data.keys[0];
					console.log('generate -->', data.keys);

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
			this.loading = false;
		},
		async regenerateKeys() {
			const array = this.keys;
			const id = array[0].keyId;
			try {
				const response = await this.regenerateApiKey({ id });
				console.log(response);
				const { status, statusText, data } = response;
				if (status === 200 && statusText === 'OK') {
					this.keys = data.keys;

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