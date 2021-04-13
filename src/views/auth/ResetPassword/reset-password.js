import { ValidationObserver } from 'vee-validate';
//import { mapGetters, mapActions, mapMutations } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import PasswordInput from '@/components/Input/PasswordInput';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo';
export default {
	name: 'Login',
	data() {
		return {
			confirm_password: null,
			new_password: null,
			loading: false
		};
	},
	created() {},
	computed: {},
	methods: {
		submit() {}
	},
	components: {
		ValidationObserver,
		TextInput,
		CButton,
		PasswordInput,
		Loader,
		Logo
	}
};
