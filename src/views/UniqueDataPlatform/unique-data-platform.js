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
import NextIcon from '../../assets/icons/next-icon.svg';
import PrevIcon from '../../assets/icons/prev-icon.svg';
import HorizontalScroll from 'vue-horizontal-scroll';
import 'vue-horizontal-scroll/dist/vue-horizontal-scroll.css';

export default {
	name: 'UniqueDataPlatform',
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
		SuspendedModal,
		HorizontalScroll
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
					name: 'Company City'
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
					name: 'Company Website'
				}
			],
			tableData: {
				id: 4,
				name: 'Kingsley Omin',
				title: 'Product Designer',
				company: 'Enyata',
				company_ll: 'link-url',
				company_contact_ll: 'link-url',
				status: 'ready',
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
				company_website: 'Klam'
			},
			count: 0,
			currentPage: 0,
			enrichedDataHistory: null,
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
			showExportModal: false,
			showInfo: true,
			hasScroll: true
		};
	},
	async mounted() {
		console.log('rourer', this.$router);
		this.getEnrichedData();
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

		let app = this;
		let table = this.$refs.table;
		function verifyScroll() {
			if (table.scrollWidth - 60 < table.clientWidth) {
				app.hasScroll = true;
			} else {
				app.hasScroll = false;
			}
		}
		verifyScroll();
		window.addEventListener('resize', verifyScroll);
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_notes/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult',
			setContactPageData: 'user/setContactPageData'
		}),
		...mapActions({
			enrichedData: 'data_enrichment/enrichedData',
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
			this.getEnrichedData();
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

		async RefreshResearch(e, id) {
			try {
				const response = await this.refresh({ id, userId: null });
				if (response.status === 200) {
					this.getEnrichedData();
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
			this.showModal = !this.showModal;
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
			this.getEnrichedData();
		},
		closeModal() {
			this.showModal = false;
		},
		async getEnrichedData() {
			this.pageLoading = true;
			try {
				// console.log(this.searchQuery);
				// return;
				let catchedEnrichData = {
					page: this.page,
					limit: this.limit,
					rowId: this.$router
				};
				const {
					data: {
						data: { enriched, count, currentPage, nextPage }
					}
				} = await this.enrichedData(catchedEnrichData);

				this.enrichedDataHistory = enriched;
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
		clickResearch() {
			// if (item.status.statusCode !== 'IN_PROGRESS') {
			// 	this.$router.push({ name: 'Insights', query: { id: item.rowId } });
			// }
			// this.$router.push({ name: 'UniqueDataPlatform', params: { id: item.search_id } });
		},
		closeSuspendedModal() {
			this.showSuspendedModal = false;
		},
		wheelHorizontal(e) {
			if (e.deltaY < 0) {
				this.$refs.table.scrollLeft = this.$refs.table.scrollLeft - 50;
			} else {
				this.$refs.table.scrollLeft = this.$refs.table.scrollLeft + 50;
			}
		},
		scrollHorizontal() {
			if (this.$refs.table.scrollLeft > 0) {
				this.showInfo = false;
			}
			if (this.$refs.table.scrollLeft == 0) {
				this.showInfo = true;
			}
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
		},
		navigationNext() {
			const nextIcon = NextIcon;
			return `<img src="${nextIcon}"/>`;
		},
		navigationPrev() {
			const prevIcon = PrevIcon;
			return `<img src="${prevIcon}"/>`;
		}
	}
};
