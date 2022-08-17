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
					name: 'Company Li'
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
			count: 0,
			currentPage: 0,
			checkedContacts: [],
			pageLoading: false,
			nextPage: null,
			prevPage: null,
			dataHistory: null,
			totalEmails: 0,
			totalContacts: 0
		};
	},
	async mounted() {
		this.getSingleResearchData();
		if (this.getLoggedUser.status === 'suspended') {
			this.tableHeaders = this.tableHeaders.slice(1);
			this.showSuspendedModal = true;
		}
	},
	methods: {
		...mapActions({
			getSingleResearch: 'data_enrichment/getSingleResearch',
			showAlert: 'showAlert'
		}),
		async getSingleResearchData() {
			this.pageLoading = true;
			let researchData = {
				query: {
					page: this.page,
					limit: this.limit
				},
				rowId: this.$route.params.id
			};
			try {
				const {
					data: {
						data: { data, count, currentPage, nextPage, prevPage, totalContacts, totalEmails }
					}
				} = await this.getSingleResearch(researchData);

				this.dataHistory = data;
				this.count = count;
				this.currentPage = currentPage;
				this.total = Math.ceil(count / this.limit);
				this.nextPage = nextPage;
				this.prevPage = prevPage;
				this.totalContacts = totalContacts;
				this.totalEmails = totalEmails;
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
		clickCallback(page) {
			this.page = page;
			this.getSingleResearchData();
		}
	},
	computed: {
		...mapGetters({
			getLoggedUser: 'auth/getLoggedUser',
			getContactPageData: 'user/getContactPageData'
		}),
		emailsFound() {
			const emailCount = `${this.totalEmails > this.totalContacts ? `${this.totalContacts}+` : this.totalEmails}/${
				this.totalContacts
			}`;
			return emailCount;
		},
		percentageOfEmailsFound() {
			let percentage = (this.totalEmails / this.totalContacts) * 100;
			if (typeof percentage !== Number) {
				percentage = 0;
			}

			return percentage > 100 ? `${100}%` : `${percentage}%`;
		}
	}
};
