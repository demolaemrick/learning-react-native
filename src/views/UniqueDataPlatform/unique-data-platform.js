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
			count: 0,
			currentPage: 0,
			enrichedDataHistory: null,
			interval: null,
			checkedContacts: [],
			pageLoading: false,
			nextPage: null,
			dataHistory: null,
			showExportModal: false,
			showInfo: true,
			hasScroll: true
		};
	},
	async mounted() {
		this.getSingleResearchData();
		if (this.getLoggedUser.status === 'suspended') {
			this.tableHeaders = this.tableHeaders.slice(1);
			this.showSuspendedModal = true;
		}

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
		...mapActions({
			getSingleResearch: 'data_enrichment/getSingleResearch',
			showAlert: 'showAlert'
		}),
		async getSingleResearchData() {
			this.pageLoading = true;
			try {
				const {
					data: {
						data: { data }
					}
				} = await this.getSingleResearch(this.$route.params.id);

				this.dataHistory = data;
				// this.count = count;
				// this.currentPage = currentPage;
				// this.total = Math.ceil(count / this.limit);
				// this.nextPage = nextPage;
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
