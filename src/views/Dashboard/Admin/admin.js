import { ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';
import CButton from '@/components/Button';
import TextInput from '@/components/Input';
import VTable from '@/components/Table';
import VHeader from '@/components/Header/search/Header';
import ToggleDropdown from '@/components/ToggleDropdown';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import Status from '@/components/Status';
import Toggle from '@/components/Toggle';
import InputTag from '@/components/InputTag';
import StatusTag from '@/components/StatusTag';

export default {
	name: 'Dashboard',
	data() {
		return {
			form: {
				email: '',
				role: ''
			},
			info: {
				name: '',
				email: '',
				role: ''
			},
			emailInput: '',
			loading: false,
			sendInvites: false,
			editModal: false,
			checkedContacts: [],
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
					name: 'Email Address'
				},
				{
					name: 'Admin Role'
				},
				{
					name: 'Status',
					sortHeader: ''
				},
				{
					name: 'Date Added'
				},
				{
					name: ' '
				}
			],
			history: [
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Super Admin',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 1,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 2,
					status: {
						statusCode: 'INACTIVE',
						message: 'Inactive'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 3,
					status: {
						statusCode: 'ACTIVE',
						message: 'active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 4,
					status: {
						statusCode: 'ACTIVE',
						message: 'active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 5,
					status: {
						statusCode: 'ACTIVE',
						message: 'active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 6,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				}
			],
			emailList: [],
			showEditModal: false,
			toggleClass: true,
			adminLoading: false,
			currentPage: 1,
			totalPages: 5,
			limit: 50,
			page: 1,
			admins: []
		};
	},
	props: {
		modalName: String
	},
	components: {
		ValidationObserver,
		CButton,
		TextInput,
		VTable,
		VHeader,
		ToggleDropdown,
		Modal,
		Status,
		Toggle,
		InputTag,
		Loader,
		StatusTag
	},
	mounted() {
		this.getAdmins();
	},
	methods: {
		...mapActions({
			adminInvite: 'admin_management/adminInvite',
			allAdmins: 'admin_management/allAdmins',
			showAlert: 'showAlert'
		}),
		async getAdmins() {
			this.adminLoading = true;
			try {
				const response = await this.allAdmins({ page: this.page, limit: this.limit });
				const { status, data, statusText } = response;
				console.log(data);
				if (status === 200 && statusText === 'OK') {
					this.admins = data.data;
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.adminLoading = false;
			}
		},
		async inviteAdmin() {
			this.loading = true;
			if (this.emailInput !== '') {
				this.emailList.push(this.emailInput);
				this.emailInput = '';
			}
			try {
				const response = await this.adminInvite({ email: this.emailList });
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Invite sent Successfully',
						showAlert: true
					});
					this.emailList = [];
					this.toggleSendInvites();
					return true;
				}
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
		toggleSendInvites() {
			if (!this.sendInvites) {
				this.sendInvites = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.sendInvites = !this.sendInvites;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		openEditModal() {
			this.editModal = !this.editModal;
		},
		addEmail(e) {
			console.log(this.emailList);
			if (e.target.validity.valid) {
				this.emailList.push(this.emailInput);
				this.emailInput = '';
			}
		},
		deleteEmail(index) {
			const list = this.emailList;
			list.splice(index, 1);
		},
		checkAll(event) {
			if (event.target.checked) {
				this.history.forEach((item) => {
					if (item.status.statusCode === 'ACTIVE' || item.status.statusCode === 'INACTIVE') {
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
		}
	}
};
