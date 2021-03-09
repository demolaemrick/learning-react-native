import VFrame from '@/components/Frame.vue';
import VTextInput from '@/components/Input';
export default {
	name: 'VSelect',
	components: {
		VFrame,
		VTextInput
	},
	props: {
		options: {
			type: Array,
			default: () => []
		},
		placeholder: {
			type: String,
			default: ''
		},
		value: {
			type: [Array, String, Number],
			default: ''
		},
		readonly: {
			type: Boolean
		},
		name: {
			type: String,
			default: ''
		},
		required: {
			type: Boolean,
			default: false
		}
	},
	model: {
		event: 'change'
	},
	data: () => ({
		optionsVisible: false,
		valueString: '',
		filteredOptions: []
	}),
	created() {
		this.value !== '' ? (this.valueString = this.value) : null;
	},
	computed: {
		localValue: {
			get() {
				return this.value;
			},
			set(data) {
				this.$emit('change', data);
			}
		},
		allValues() {
			if (this.options[0].label) {
				return this.options.map(({ label }) => label).join(',');
			} else {
				return this.options.join(',');
			}
		}
	},
	watch: {
		localValue(val) {
			if (val) {
				this.optionsVisible = false;
				const selected = this.options.find((option) => option.value === val || option === val);
				this.valueString = selected.label || selected;
			}
		},
		valueString(val) {
			if (val) {
				this.$emit('update', this.valueString);
			}
		}
	},
	mounted() {
		this.filteredOptions = this.options;
	},
	methods: {
		handleFocus(e) {
			// Fix IE11 quirks.
			if (e.target.tagName === 'DIV') return;
			this.optionsVisible = true;
		},
		handleOutsideFocus() {
			this.optionsVisible = false;
		},
		filterOptions() {
			this.filteredOptions = this.options.filter((it) => it.toLowerCase().includes(this.valueString.toLowerCase()));
		},
		clearFilter() {
			setTimeout(() => {
				this.filteredOptions = this.options;
			}, 2000);
		}
	}
};
