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
import VHeader from '@/components/Header/dataEnrichment/Header';
import ConfigData from '../ConfigImportData/ConfigImportData.vue';
import researchMixin from '@/mixins/research';
import csvMixins from '@/mixins/csvMixins';
import moment from 'moment';

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
					name: 'Status'
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
					name: 'Parameters'
				},
				{
					name: 'Client'
				},
				{
					name: 'Outreach Owner Email'
				},
				{
					name: 'BDR Owner'
				},
				{
					name: 'Run Time'
				},
				{
					name: 'Date'
				},

				{
					name: ' '
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
			dataToDelete: {},
			deleting: false,
			showExportModal: false,
			subscriptionDone: false,
			subscriptionRunTime: null
		};
	},
	mounted() {
		if (this.getLoggedUser.status === 'suspended') {
			this.tableHeaders = this.tableHeaders.slice(1);
			this.showSuspendedModal = true;
		}

		let { page, limit, sortQuery, keyword, currentPage, count, nextPage, total } = this.getContactPageData;
		this.page = page;
		this.limit = limit;
		this.sortQuery = sortQuery ? sortQuery : null;
		this.searchQuery = keyword;
		this.currentPage = currentPage;
		this.total = total;
		this.count = count;
		this.nextPage = nextPage ? nextPage : null;

		this.pageLoading = true;
		this.getHistory();
	},
	methods: {
		...mapActions({
			enrichmentHistory: 'data_enrichment/enrichmentHistory',
			exportDataEnrichmentsHistory: 'data_enrichment/exportDataEnrichmentsHistory',
			deleteEnrichmentHistory: 'data_enrichment/deleteEnrichmentData',
			refresh: 'data_enrichment/refresh',
			subscribeResearch: 'search_services/subscribeResearch',
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
			this.pageLoading = true;
			this.getHistory();
		},
		async getHistory() {
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

				let sortedHistory = history.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));

				this.history = sortedHistory;
				this.count = count;
				this.currentPage = currentPage;
				this.total = Math.ceil(count / this.limit);
				this.nextPage = nextPage;

				this.checkPendingStatus();
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
		async subscribe() {
			let self = this;
			setTimeout(() => {
				if (!self.subscriptionDone) {
					self.getHistory();
				}
			}, 60000);
			try {
				const response = await this.subscribeResearch();
				if (response.status === 200) {
					this.subscriptionDone = true;
					await this.history.map((data) => {
						if (data.rowId === response.data.done.rowId) {
							data.status = response.data.done.status === 'success' ? 'ready' : response.data.done.status;
							data.totalContacts = response.data.done.response.totalContacts;
							data.totalEmails = response.data.done.response.totalEmails;
							data.parameters = response.data.done.response.parameters;

							this.subscriptionRunTime = this.runTime(
								response.data.done.response.endTime,
								response.data.done.response.startTime
							);
						}
						return data;
					});
					this.checkPendingStatus();
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
		async checkPendingStatus() {
			let pendingStatus = await this.history.filter((data) => {
				return data.status === 'in-progress' || data.status === 'updating';
			});
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
		returnFirstParameter(item) {
			return Object.values(item.parameters)[0];
		},
		handleRowClick(item) {
			const firstParameter = this.returnFirstParameter(item);

			if (item.status !== 'in-progress') {
				this.$router.push({
					name: 'UniqueDataPlatform',
					params: { id: item.rowId, clientName: item.clientName, parameter: firstParameter }
				});
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
			this.deleting = true;
			let deleteData = null;
			if (this.checkedDataEnrichments.length && !this.dataToDelete.rowId) {
				deleteData = {
					rows: this.checkedDataEnrichments
				};
				if (this.checkedDataEnrichments.length === this.limit && this.page === this.total) {
					let page = this.page - 1;
					this.page = page !== 0 ? page : 1;
				}
			} else {
				deleteData = {
					id: this.dataToDelete.rowId
				};
			}
			try {
				const { status } = await this.deleteEnrichmentHistory(deleteData);
				if (status === 200) {
					await this.getHistory();
					this.toggleModal('showModal');
					this.showAlert({
						status: 'success',
						message: 'Data enrichment history deleted successfully',
						showAlert: true
					});
				}
			} catch (error) {
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
		async refreshResearch(_, id) {
			try {
				const response = await this.refresh(id);
				if (response.status === 200) {
					this.getHistory();
				}
			} catch (error) {
				if (error.response) {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
				}
			}
		},
		openDeleteModal(e, rowId) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			this.dataToDelete = { rowId };
			this.showModal = true;
		},
		closeSuspendedModal() {
			this.showSuspendedModal = false;
		},
		runTime(endTime, startTime) {
			let runTimeStr = '-';

			if (startTime && endTime && moment(endTime).isValid() && moment(startTime).isValid()) {
				let start = moment(startTime);
				let end = moment(endTime);
				let runTime = end.diff(start, 'seconds');
				if (runTime < 0) {
					runTimeStr = 0 + ' Sec';
				} else if (runTime <= 60) {
					runTimeStr = `${runTime} Secs`;
				} else {
					runTimeStr = `${Math.floor(runTime / 60)} Min${Math.floor(runTime / 60) > 1 ? 's' : ''}, ${runTime % 60} Sec${
						runTime % 60 > 1 ? 's' : ''
					}`;
				}
			}
			return runTimeStr;
		}
	},

	computed: {
		...mapGetters({
			getLoggedUser: 'auth/getLoggedUser',
			getContactPageData: 'user/getContactPageData'
		})
	}
};
