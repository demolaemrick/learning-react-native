export default {
	data() {
		return {
			size: 10,
			currentPage: 0,
			from: 0,
			to: 9,
			sortBy: null,
			sortType: 'asc'
		};
	},
	computed: {
		paginatedTableData() {
			let start = Number(this.currentPage) * Number(this.size),
				end = start + Number(this.size);
			return this.sortedData.slice(start, end);
		}
	},
	methods: {
		goToNextPage() {
			this.currentPage++;
		},
		goToPrevPage() {
			this.currentPage--;
		},
		sortTableFunc(value) {
			if (value) {
				let id = value.toLowerCase();
				if (this.sortType === 'asc') {
					if (value === 'createdAt' || value === 'updatedAt') {
						this.tableData.sort((a, b) => {
							return new Date(a[value]) - new Date(b[value]);
						});
					} else {
						this.tableData.sort((a, b) => (a[id] < b[id] ? -1 : 1));
					}
					this.sortType = 'desc';
				} else {
					if (value === 'createdAt' || value === 'updatedAt') {
						this.tableData.sort((a, b) => {
							return new Date(b[value]) - new Date(a[value]);
						});
					} else {
						this.tableData.sort((a, b) => (b[id] < a[id] ? -1 : 1));
					}
					this.sortType = 'asc';
				}
			}
		}
	}
};
