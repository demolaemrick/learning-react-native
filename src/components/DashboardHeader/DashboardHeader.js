import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations } from 'vuex';
export default {
	name: 'DashboardHeader',
	components: {
		ToggleDropdown
	},
	methods: {
		...mapMutations({
			logout: 'auth/logout'
		}),
		logoutUser() {
			this.logout();
			this.$router.push('/login');
		}
	}
};
