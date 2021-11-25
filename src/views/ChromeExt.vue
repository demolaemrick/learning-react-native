<template>
	<div>
		<p v-if="!done">Please wait...</p>
		<div v-else class="can_close">
			<img class="" src="@/assets/icons/volley-icon.svg" width="80" height="80" svg-inline />
			<p>You can close this window</p>
			<span v-if="canClose">Page automatically closes in 10sec</span>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			popup: false,
			done: false,
			canClose: true
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
					this.done = true;
					this.$router.replace({ path: '/chrome-ext' });
					setTimeout(() => {
						window.close();
					}, 10000);
				}
			} else {
				this.logout();
				this.$router.replace({ path: '/chrome-ext' });
				this.done = true;
				setTimeout(() => {
					window.close();
				}, 10000);
			}
		} else {
			this.done = true;
			this.canClose = false;
		}
	}
};
</script>

<style>
.can_close {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column;
	width: 100%;
	height: 100vh;
	padding: 15px;
}
.can_close svg {
	margin-bottom: 10px;
	transform: translateY(-50px);
	filter: drop-shadow(0px 0px 5px #ccc);
}
.can_close p {
	font-size: 2rem;
	font-weight: lighter;
	color: #333758;
	text-align: center;
}
</style>
