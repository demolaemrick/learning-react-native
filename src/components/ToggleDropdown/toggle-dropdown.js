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
				if (dropdownList) {
					dropdownList.forEach((element) => {
						element.addEventListener('click', () => {
							this.showDropdown = false;
						});
					});
				}
				const dropdown = document.getElementById('dropdown-list');
				if (dropdown) {
					dropdown.addEventListener('blur', () => {
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
