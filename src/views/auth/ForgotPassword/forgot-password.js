import { ValidationObserver } from 'vee-validate';
//import { mapGetters, mapActions, mapMutations } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo'
export default {
	name: 'Login',
	data() {
		return {
			form: {
				email: null,
				password: null,
				isNotify: false
			},
			loading: false
		};
	},
	created() {
	},
	computed: {
	},
	methods: {
		submit() {},
	},
	components: {
		ValidationObserver,
		TextInput,
		CButton,
		Loader,
		Logo
	}
};
