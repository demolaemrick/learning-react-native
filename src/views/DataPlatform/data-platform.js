import VCheckbox from '@/components/Checkbox';
import VButton from '@/components/Button';
import VTextInput from '@/components/Input';
import VModal from '@/components/Modal';
import SuspendedModal from '@/components/SuspendedModal.vue';
import VTabs from '@/components/Tabs';
import VTab from '@/components/Tabs/Tab';
import VToggleDropdown from '@/components/ToggleDropdown';
import VTable from '@/components/Table';
import { ValidationObserver } from 'vee-validate';
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/Loader';
import FileUpload from 'vue-upload-component';
import Logo from '@/components/Logo';
import VHeader from '@/components/Header/search/Header';
import ConfigData from '../ConfigImportData/ConfigImportData.vue';
import researchMixin from '@/mixins/research';
import csvMixins from '@/mixins/csvMixins';

export default {
	name: 'DataPlatform',
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
		ConfigData,
		SuspendedModal
	},
	data() {
		return {
			limit: 10,
			page: 1,
			total: 0,
			loading: false,
			tableHeaders: [
				{
					name: '',
					elementSlot: true
				},
				{
					name: 'Search ID'
				},
				{
					name: 'Search Type',
					width: 'small'
				},

				{
					name: 'Original Data Source',
					width: 'small'
				},
				{
					name: 'Total Contacts',
					width: 'small'
				},
				{
					name: 'Emails Found',
					width: 'small'
				},
				{
					name: 'Client'
				},
				{
					name: 'Outreach Owner Email',
					width: 'small'
				},
				{
					name: 'BDR Owner',
					width: 'medium'
				},
				{
					name: 'Parameters',
					width: 'large'
				},
				{
					name: 'Date',
					width: 'medium'
				},
				{
					name: 'Status'
				}
			],
			count: 0,
			currentPage: 0,
			history: null,
			interval: null,
			checkedDataEnrichments: [],
			pageLoading: false,
			nextPage: null,
			toggleClass: true,
			showModal: false,
			exportLoading: false,
			showSuspendedModal: false,
			deleting: false,
			showExportModal: false
		};
	},
	mounted() {
		this.getHistory();
	},
	methods: {
		...mapActions({
			enrichmentHistory: 'data_enrichment/enrichmentHistory',
			exportDataEnrichmentsHistory: 'data_enrichment/exportDataEnrichmentsHistory',
			deleteEnrichmentHistory: 'data_enrichment/deleteEnrichmentData',
			showAlert: 'showAlert'
		}),

		checkAll(event) {
			if (event.target.checked) {
				this.history.forEach((item) => {
					if (item.status === 'ready' || item.status === 'done') {
						this.checkedDataEnrichments.push(item.rowId);
						return item.rowId;
					}
				});
			} else {
				this.checkedDataEnrichments = [];
			}
		},
		clickCallback(page) {
			this.page = page;
			this.checkedDataEnrichments = [];
			this.getHistory();
		},
		async getHistory() {
			this.pageLoading = true;
			try {
				let historyData = {
					page: this.page,
					limit: this.limit
				};
				const {
					data: {
						data: { history, count, currentPage, nextPage }
					}
				} = await this.enrichmentHistory(historyData);

				this.history = history;
				this.count = count;
				this.currentPage = currentPage;
				this.total = Math.ceil(count / this.limit);
				this.nextPage = nextPage;
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
		validateURL(link) {
			if (link.indexOf('https://') === 0 || link.indexOf('http://') === 0) {
				return link;
			} else {
				return `https://${link}`;
			}
		},
		handleRowClick(item) {
			if (item.status !== 'IN_PROGRESS') {
				this.$router.push({ name: 'UniqueDataPlatform', params: { id: item.rowId } });
			}
		},
		async exportCSV() {
			this.exportLoading = true;

			try {
				let exportData = null;
				if (this.checkedDataEnrichments.length) {
					exportData = {
						rows: this.checkedDataEnrichments
					};
				}
				const response = await this.exportDataEnrichmentsHistory(exportData);

				let csvContent = 'data:text/csv;charset=utf-8,';
				let csvData = new Blob([response.data], {
					type: csvContent
				});

				let csvUrl = URL.createObjectURL(csvData);

				const link = document.createElement('a');
				link.setAttribute('href', csvUrl);
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
				this.checkedDataEnrichmentss = [];
			}
		},
		toggleModal(modal) {
			if (!this[modal]) {
				this[modal] = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this[modal] = !this[modal];
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		async deleteEnrichmentData() {
			try {
				this.deleting = true;
				let deleteData = null;
				if (this.checkedDataEnrichments.length) {
					deleteData = {
						rows: this.checkedDataEnrichments
					};
				}
				const response = await this.deleteEnrichmentData(deleteData);
				console.log(response);

				const { status, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					// this.searchQuery = '';
					// this.page = 1;
					await this.getHistory();
					this.toggleModal('showModal');
					this.showAlert({
						status: 'success',
						message: 'Data enrichment history deleted successfully',
						showAlert: true
					});
				}
				this.deleting = false;
			} catch (error) {
				console.log(error.message);

				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
				this.deleting = false;
			} finally {
				this.checkedContacts = [];
				this.deleting = false;
			}
		},
		openDeleteModal(e, rowId, full_name) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			this.contactToDelete = { rowId, full_name };
			this.showModal = true;
		}
	},

	computed: {
		...mapGetters({
			getLoggedUser: 'auth/getLoggedUser',
			getContactPageData: 'user/getContactPageData'
		})
	}
};
