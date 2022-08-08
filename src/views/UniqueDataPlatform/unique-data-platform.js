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
import debounce from 'lodash.debounce';

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
					name: 'Name'
				},
				{
					name: 'Title'
				},
				{
					name: 'Company'
				},
				{
					name: 'Company Ll'
				},
				{
					name: 'Contact Ll'
				},
				{
					name: 'Outreach Status'
				},
				{
					name: 'Email'
				},
				{
					name: 'Email Verification'
				},
				{
					name: 'Seniority'
				},
				{
					name: 'Function'
				},
				{
					name: 'Company Headcount'
				},
				{
					name: 'Company Industry'
				},
				{
					name: 'Company Revenue'
				},
				{
					name: 'Company  City'
				},
				{
					name: 'Company State'
				},
				{
					name: 'Company Country'
				},
				{
					name: 'Company Keywords'
				},
				{
					name: 'Company website'
				}
			],
			tableData: {
				name: 'Kingsley Omin',
				title: 'Product Designer',
				company: 'Enyata',
				company_ll: 'link-url',
				company_contact_ll: 'link-url',
				status: {
					statusCode: 'READY',
					message: 'Ready'
				},
				email: 'Kingsleyomin@enyata.com',
				email_verification: 'Valid',
				seniority: 'Manager',
				function: 'Function',
				company_headcount: '200',
				company_industry: 'London',
				company_revenue: 'London',
				company_city: 'London',
				company_state: 'London',
				company_country: 'England',
				company_keywords: 'Klam',
				company_websites: 'Klam'
			},
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
	async mounted() {
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

		// this.pageLoading = true;
		// await this.getHistory();
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_notes/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult',
			setContactPageData: 'user/setContactPageData'
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
			try {
				// console.log(this.searchQuery);
				// return;
				let historyData = {
					page: this.page,
					limit: this.limit,
					...this.sortQuery
				};
				if (this.searchQuery && this.searchQuery.trim().length) {
					historyData.keyword = this.searchQuery;
				}

				const response = await this.research_history(historyData);
				// this.history = [];
				this.history = response.data.data.history;
				this.count = response.data.data.count;
				this.currentPage = response.data.data.currentPage;
				this.total = Math.ceil(response.data.data.count / this.limit);
				this.nextPage = response.data.data.nextPage;
				this.setContactPageData({
					page: this.page,
					limit: this.limit,
					sortQuery: this.sortQuery,
					keyword: this.searchQuery,
					currentPage: response.data.data.currentPage,
					count: response.data.data.count,
					nextPage: response.data.data.nextPage,
					total: Math.ceil(response.data.data.count / this.limit)
				});
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
		validateURL(link) {
			if (link.indexOf('https://') === 0 || link.indexOf('http://') === 0) {
				return link;
			} else {
				return `https://${link}`;
			}
		},
		clickResearch() {
			// if (item.status.statusCode !== 'IN_PROGRESS') {
			// 	this.$router.push({ name: 'Insights', query: { id: item.rowId } });
			// }
			// this.$router.push({ name: 'UniqueDataPlatform', params: { id: item.search_id } });
		},
		closeSuspendedModal() {
			this.showSuspendedModal = false;
		}
	},
	computed: {
		...mapGetters({
			getLoggedUser: 'auth/getLoggedUser',
			getContactPageData: 'user/getContactPageData'
		}),
		contactImage(item) {
			const images = item.images;
			if (images && images.length) {
				return images[Math.floor(Math.random() * images.length)];
			}
		}
	},
	watch: {
		searchQuery: debounce(function (newVal) {
			if (newVal) {
				if (!this.pageLoading) {
					this.page = 1;
					this.getHistory();
				}
			} else {
				this.page = 1;
				this.getHistory();
			}
		}, 600)
	}
};
