import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations } from 'vuex';
export default {
	name: 'SearchResult',
	components: {
		// VHeader,
		ToggleDropdown
	},
	methods:{
		...mapMutations({
			logout: 'auth/logout'
		}),
		logoutUser() {
			this.logout();
			this.$router.push('/login');
		}
	}
};
