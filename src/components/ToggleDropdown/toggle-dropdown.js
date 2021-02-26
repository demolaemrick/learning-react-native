export default {
	name: 'ToggleDropdown',
	data() {
		return {
			showDropdown: false
		};
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
