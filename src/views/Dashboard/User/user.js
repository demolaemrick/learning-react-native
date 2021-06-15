import { ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';
import CButton from '@/components/Button';
import VTabs from '@/components/Tabs';
import VTab from '@/components/Tabs/Tab';
import VTextInput from '@/components/Input';
import TextInput from '@/components/Input';
import VTable from '@/components/Table';
import VHeader from '@/components/Header/search/Header';
import Toggle from '@/components/Toggle';
import Status from '@/components/Status';
import ToggleDropdown from '@/components/ToggleDropdown';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import FileUpload from 'vue-upload-component';

export default {
	name: 'User',
	data() {
		return {
			form: {
				first_name: '',
				last_name: '',
				email: '',
				organisation: '',
				monthly_research: '',
				profession: '',
				password: '',
				role: ''
			},
			showEditModal: false,
			contactModal: false,
			checkedContacts: [],
			loading: true,
			// userLoading: false,
			toggleClass: true,
			tableHeaders: [
				{
					name: '',
					elementSlot: true
				},
				{
					name: 'Name',
					sortHeader: 'full_name'
				},
				{
					name: 'Company',
					sortHeader: 'company'
				},
				{
					name: 'Title',
					sortHeader: ''
				},
				{
					name: 'Linkedin',
					sortHeader: ''
				},
				{
					name: 'Score'
				},
				{
					name: 'Last update'
				},
				{
					name: 'Status',
					sortHeader: ''
				},
				{
					name: ' '
				}
			],
			history: [],
			activeTab: 'details',
			accept: 'csv',
			extensions: 'csv',
			files: [],
			csvImport: {
				contacts: null,
				is_csv: true
			},
			userId: null,
			userDetails: [],
			usersLoading: false,
			count: 0,
			currentPage: 1,
			totalPages: 10,
			pageLoading: false,
			nextPage: null
		};
	},
	components: {
		ValidationObserver,
		CButton,
		VTabs,
		VTab,
		VTextInput,
		TextInput,
		VTable,
		VHeader,
		Toggle,
		Loader,
		Status,
		ToggleDropdown,
		Modal,
		FileUpload
	},
	methods: {
		...mapActions({
			showAlert: 'showAlert',
			getSingleUser: 'users_management/singleUser',
			research_history: 'users_management/research_history',
			bulk_research: 'users_management/bulk_research',
			subscribeResearch: 'search_services/subscribeResearch'
		}),
		toggleEditModal() {
			if (!this.showEditModal) {
				this.showEditModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.showEditModal = !this.showEditModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		toggleUploadContact() {
			if (!this.contactModal) {
				this.contactModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.contactModal = !this.contactModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		setActiveTab(evt) {
			switch (evt) {
				case 'details':
					this.activeTab = evt;
					break;
				case 'contacts':
					this.activeTab = evt;
					this.getHistory();
					break;
				case 'settings':
					this.activeTab = evt;
					break;
			}
		},
		checkAll(event) {
			if (event.target.checked) {
				this.history.forEach((item) => {
					if (item.status.statusCode === 'DONE' || item.status.statusCode === '') {
						this.checkedContacts.push(item.rowId);
						return item.rowId;
					}
					return item.rowId;
				});
			} else {
				this.checkedContacts = [];
			}
		},
		clickCallback(page) {
			this.currentPage = page;
		},
		backToUsers() {
			this.$router.push({ name: 'Users' });
		},
		inputFile(newFile) {
			if (newFile.size > 10485760) {
				this.showAlert({
					status: 'error',
					message: 'file size is is more that 10MB',
					showAlert: true
				});
				return true;
			}
			if (newFile.name.split('.').pop() !== 'csv') {
				this.showAlert({
					status: 'error',
					message: 'file type is not csv',
					showAlert: true
				});
				return true;
			}
			const readFile = async (event) => {
				const csvFilePath = event.target.result;
				this.csvImport.contacts = await this.csvJSON(csvFilePath);
				this.uploadBulkResearch();
			};
			var file = newFile.file;

			var reader = new FileReader();
			reader.readAsText(file);
			reader.addEventListener('load', readFile);
		},
		csvJSON(csv) {
			var lines = csv.split('\n');

			var result = [];
			var headers = lines[0].split(',');

			for (var i = 1; i < lines.length; i++) {
				var obj = {};
				var currentline = lines[i].split(',');

				for (var j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentline[j];
				}

				result.push(obj);
			}
			return JSON.parse(JSON.stringify(result));
		},
		async uploadBulkResearch() {
			this.loading = true;
			try {
				await this.bulk_research({ id: this.userId, contacts: this.csvImport });
				this.page = 1;
				this.pageLoading = true;
				this.toggleUploadContact();
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
		async getHistory() {
			this.pageLoading = true;
			try {
				const response = await this.research_history({ id: this.userId, page: this.page, limit: this.limit });
				console.log(response);
				this.history = response.data.data;
				// this.count = response.data.data.count;
				// this.currentPage = response.data.data.currentPage;
				// this.total = Math.ceil(response.data.data.count / this.limit);
				// this.nextPage = response.data.data.nextPage;
				this.checkPendngStatus();
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.pageLoading = false;
			}
		},
		async checkPendngStatus() {
			let pendingStatus = await this.history.filter((data) => {
				return data.status.statusCode === 'IN_PROGRESS' || data.status.statusCode === 'UPDATING';
			});
			if (pendingStatus.length > 0) {
				this.subscribe();
			}
		},
		async subscribe() {
			try {
				const response = await this.subscribeResearch();
				if (response.status === 200) {
					await this.history.map((data) => {
						if (data.rowId === response.data.done.rowId) {
							data.status = response.data.done.status;
							data.research_score = response.data.done.research_score;
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
		async fetchUser() {
			try {
				const response = await this.getSingleUser(this.userId);
				const { status, data, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					console.log(status);
					console.log(statusText);
					this.userDetails = data.data;
					console.log(this.userDetails);
					// console.log(singleUser);
					// console.log(data.data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false;
			}
		}
	},
	mounted() {
		this.userId = this.$route.query.userId;
		this.fetchUser();
		// console.log(this.userDetails);
	}
};
