export default {
	name: 'ToggleDropdown',
	data() {
		return {
			showDropdown: false
		};
	},
	props: {
		itemPadding: {
			type: String,
			default: '1rem'
		},
		width: {
			type: String,
			default: ''
		},
		left: {
			type: String,
			default: null
		},
		closeOnClick: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		// padding() {
		// 	return { padding: this.itemPadding };
		// },
	},
	methods: {
		onClose() {
			console.log('here');
			this.showDropdown = false;
		},
		toggleDropDown(e) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			this.showDropdown = !this.showDropdown;
		}
	},
	watch: {
		showDropdown() {
			this.$nextTick(() => {
				const dropdownList = document.getElementsByClassName('dropdown__item');
				if (dropdownList && this.closeOnClick) {
					dropdownList.forEach((element) => {
						element.addEventListener('click', () => {
							this.showDropdown = false;
						});
					});
				}
				const dropdown = document.getElementById('dropdown-list');
				if (dropdown) {
					dropdown.addEventListener('blur', (event) => {
						// if a child element of the dropdown is clicked
						// it should not be considered as blur
						if (event.currentTarget.contains(event.relatedTarget)) {
							dropdown.focus();
							return;
						}
						setTimeout(() => {
							this.showDropdown = false;
						}, 200);
					});
					dropdown.focus();
				}
			});
		}
	}
};
