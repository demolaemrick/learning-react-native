import { ValidationProvider } from 'vee-validate';
import InputMixin from '../../../mixins/input';
import '../../../utils/validators';
export default {
	name: 'InputWrapper',
	components: {
		ValidationProvider
	},
	created() {},
	mixins: [InputMixin]
};
