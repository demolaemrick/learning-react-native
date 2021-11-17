<template>
	<div>Please wait</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			popup: false
		};
	},
	methods: {
		...mapMutations({
			logout: 'auth/logout',
			saveUserSession: 'auth/loginSuccess'
		})
	},
	beforeMount() {
		if (this.$route.query) {
			let { popup, vt, id } = this.$route.query;
			this.popup = this.$route.query && popup === 'true' ? true : false;
			if (vt) {
				const decode = Buffer.from(this.$route.query.vt, 'base64').toString('utf-8');
				const decoded = JSON.parse(decode);
				this.saveUserSession(decoded);

				if (!this.popup && id) {
					this.$router.push({ path: '/insights', query: { id } });
				} else {
					setTimeout(() => {
						window.close();
					}, 1000);
				}
			} else {
				this.logout();
				this.$router.push('/login');
				if (this.popup) {
					setTimeout(() => {
						window.close();
					}, 10);
				}
			}
		}
	}
};
</script>

<style></style>
