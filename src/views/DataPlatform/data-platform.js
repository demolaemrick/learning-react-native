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
import { mapMutations, mapActions, mapGetters } from 'vuex';
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
					name: 'Search ID'
				},
				{
					name: 'Search Type',
					width: 'small'
				},
				{
					name: 'Parameters',
					width: 'large'
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
			checkedContacts: [],
			pageLoading: false,
			nextPage: null,
			toggleClass: true,
			showModal: false,
			contactToDelete: {},
			exportLoading: false,
			sortQuery: null,
			deleting: false,
			subscriptionDone: false,
			showSuspendedModal: false,
			searchQuery: '',
			showExportModal: false
		};
	},
	mounted() {
		this.getHistory();
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_notes/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult',
			setContactPageData: 'user/setContactPageData'
		}),
		...mapActions({
			enrichmentHistory: 'data_enrichment/enrichmentHistory',
			subscribeResearch: 'search_services/subscribeResearch',
			export_history: 'search_services/export_history',
			bulk_research: 'search_services/bulk_research',
			deleteSingleResearch: 'search_services/deleteSingleResearch',
			refresh: 'search_services/refresh',
			showAlert: 'showAlert'
		}),

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
		openDeleteModal(e, rowId, full_name) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			this.contactToDelete = { rowId, full_name };
			this.showModal = true;
		},

		clickCallback(page) {
			// console.log(page);
			this.page = page;
			this.checkedContacts = [];
			this.getHistory();
		},
		async getHistory() {
			this.pageLoading = true;
			try {
				// console.log(this.searchQuery);
				// return;
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
			// if (item.status.statusCode !== 'IN_PROGRESS') {
			// this.$router.push({ name: 'UniqueDataPlatform', params: { rowId: item.rowId } });
			// }
			this.$router.push({ name: 'UniqueDataPlatform', query: { id: item.rowId } });
		}
	},
	computed: {
		...mapGetters({
			getLoggedUser: 'auth/getLoggedUser',
			getContactPageData: 'user/getContactPageData'
		})
	}
};
