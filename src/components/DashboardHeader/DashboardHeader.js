import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters } from 'vuex';
export default {
	name: 'SearchResult',
	components: {
		// VHeader,
		ToggleDropdown
	},
	methods: {
		...mapMutations({
			logout: 'auth/logout'
		}),
		logoutUser() {
			this.logout();
			this.$router.push('/login');
		},
		textFormatter(string) {
			return string
				.split(' ')
				.map((el) => {
					let [first, ...rest] = el;
					return `${first.toUpperCase()}${rest.join('').toLowerCase()}`;
				})
				.join(' ');
		}
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		})
	}
};
