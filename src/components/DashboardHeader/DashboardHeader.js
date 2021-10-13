import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters } from 'vuex';
export default {
	name: 'DashboardHeader',
	props: {
		toggleActive: {
			type: Function
		}
	},
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
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		}),
		loggedIn() {
			return this.loggedInUser;
		}
	}
};
