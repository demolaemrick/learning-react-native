import VCheckbox from '@/components/Checkbox';
import VButton from '@/components/Button';
import VTextInput from '@/components/Input';
import VModal from '@/components/Modal';
import VTabs from '@/components/Tabs';
import VTab from '@/components/Tabs/Tab';
import VToggleDropdown from '@/components/ToggleDropdown';
import VTable from '@/components/Table';
import { ValidationObserver } from 'vee-validate';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import Loader from '@/components/Loader';
import FileUpload from 'vue-upload-component';
import Logo from '@/components/Logo';
import VHeader from '@/components/Header/search/Header';
import ConfigData from '../ConfigImportData/ConfigImportData.vue';
import researchMixin from '@/mixins/research';
import csvMixins from '@/mixins/csvMixins';
export default {
	name: 'ContactResearch',
	mixins: [researchMixin, csvMixins],
	components: {
		VCheckbox,
		VTextInput,
		VButton,
		VModal,
		VTab,
		VTabs,
		VToggleDropdown,
		VTable,
		ValidationObserver,
		Loader,
		FileUpload,
		Logo,
		VHeader,
		ConfigData
	},
	data() {
		return {
			limit: 10,
			page: 1,
			total: 0,
			loading: false,
			accept: 'csv',
			extensions: 'csv',
			files: [],
			activeTab: 'manual_search',
			tableHeaders: [
				{
					name: '',
					elementSlot: true
				},
				{
					name: 'Name',
					sortable: true,
					sortHeader: 'full_name'
				},
				{
					name: 'Company',
					sortable: true,
					sortHeader: 'company'
				},
				{
					name: 'Title'
				},
				{
					name: 'Linkedin'
				},
				{
					name: 'Research Score',
					sortable: true,
					sortHeader: 'research_score'
				},
				{
					name: 'Last updated',
					sortable: true,
					sortHeader: 'updatedAt'
				},
				{
					name: 'Research Status'
				},
				{
					name: ' '
				}
			],
			count: 0,
			currentPage: 0,
			history: null,
			interval: null,
			checkedContacts: [],
			pageLoading: false,
			nextPage: null,
			toggleClass: true,
			showModal: false,
			contactToDelete: {},
			exportLoading: false,
			sortQuery: null,
			deleting: false,
			subscriptionDone: false
		};
	},
	async mounted() {
		if (this.loggedInUser.status === 'suspended') {
			this.tableHeaders = this.tableHeaders.slice(1);
		}
		this.pageLoading = true;
		await this.getHistory();
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_notes/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			research_history: 'search_services/research_history',
			subscribeResearch: 'search_services/subscribeResearch',
			export_history: 'search_services/export_history',
			bulk_research: 'search_services/bulk_research',
			deleteSingleResearch: 'search_services/deleteSingleResearch',
			refresh: 'search_services/refresh',
			showAlert: 'showAlert'
		}),
		sortTable(data) {
			this.sortQuery = data;
			this.getHistory();
		},
		async RefreshResearch(e, id) {
			try {
				const response = await this.refresh({ id, userId: null });
				if (response.status === 200) {
					this.getHistory();
				}
			} catch (error) {
				// console.log(error);
				if (error.response) {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
				}
			}
		},
		toggleModal() {
			if (!this.showModal) {
				this.showModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.showModal = !this.showModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		openDeleteModal(e, rowId, full_name) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			this.contactToDelete = { rowId, full_name };
			this.showModal = true;
		},
		async deleteResearch() {
			try {
				this.deleting = true;

				const research = await this.deleteSingleResearch(this.contactToDelete.rowId);
				const { status, statusText } = research;
				if (status === 200 && statusText === 'OK') {
					await this.getHistory();
					this.toggleModal();
					this.showAlert({
						status: 'success',
						message: 'Research deleted successfully',
						showAlert: true
					});
				}
				this.deleting = false;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
				this.deleting = false;
			}
		},
		async uploadBulkResearch() {
			this.loading = true;
			try {
				await this.bulk_research(this.csvImport);
				this.page = 1;
				this.openConfigPage = false;
				this.pageLoading = true;
				await this.getHistory();
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.loading = false;
			}
		},
		checkAll(event) {
			if (event.target.checked) {
				this.history.forEach((item) => {
					if (item.status.statusCode === 'READY' || item.status.statusCode === 'DONE') {
						this.checkedContacts.push(item.rowId);
						return item.rowId;
					}
				});
			} else {
				this.checkedContacts = [];
			}
		},
		clickCallback(page) {
			// console.log(page);
			this.page = page;
			this.getHistory();
		},
		async exportCSV() {
			this.exportLoading = true;
			try {
				const response = await this.export_history({ rows: this.checkedContacts });
				let csvContent = 'data:text/csv;charset=utf-8,';
				csvContent += [response.data];

				const data = encodeURI(csvContent);
				const link = document.createElement('a');
				link.setAttribute('href', data);
				link.setAttribute('download', 'export.csv');
				link.click();
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.exportLoading = false;
			}
		},
		async subscribe() {
			let self = this;
			setTimeout(() => {
				if (!self.subscriptionDone) {
					self.getHistory();
				}
			}, 120000);
			try {
				const response = await this.subscribeResearch();
				if (response.status === 200) {
					this.subscriptionDone = true;
					await this.history.map((data) => {
						if (data.rowId === response.data.done.rowId) {
							data.status = response.data.done.status;
							data.research_score = response.data.done.research_score;
							data.linkedin = response.data.done.linkedin;
							data.images = response.data.done.images;
						}
						return data;
					});
					this.checkPendngStatus();
				}
				if (response.status >= 500) {
					this.getHistory();
				}
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async getHistory() {
			try {
				const response = await this.research_history({ page: this.page, limit: this.limit, ...this.sortQuery });
				this.history = response.data.data.history;
				this.count = response.data.data.count;
				this.currentPage = response.data.data.currentPage;
				this.total = Math.ceil(response.data.data.count / this.limit);
				this.nextPage = response.data.data.nextPage;
				this.checkPendngStatus();
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response && error.response.data.message,
					showAlert: true
				});
				return error;
			} finally {
				this.pageLoading = false;
			}
		},
		async checkPendngStatus() {
			let pendingStatus = await this.history.filter((data) => {
				return data.status.statusCode === 'IN_PROGRESS' || data.status.statusCode === 'UPDATING';
			});
			// console.log(pendingStatus);
			if (pendingStatus.length > 0) {
				this.subscribe();
			}
		},
		validateURL(link) {
			if (link.indexOf('https://') === 0 || link.indexOf('http://') === 0) {
				return link;
			} else {
				return `https://${link}`;
			}
		},
		clickResearch(item) {
			if (item.status.statusCode !== 'IN_PROGRESS') {
				this.$router.push({ name: 'Insights', query: { id: item.rowId } });
			}
		}
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		}),
		contactImage(item) {
			const images = item.images;
			if (images && images.length) {
				return images[Math.floor(Math.random() * images.length)];
			}
		}
	}
};
