import { ValidationObserver } from 'vee-validate';
import CButton from '@/components/Button';
import TextInput from '@/components/Input';
import VTable from '@/components/Table';
import VHeader from '@/components/Header/search/Header';
import VButton from '@/components/Button';
import ToggleDropdown from '@/components/ToggleDropdown';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import PasswordInput from '@/components/Input/PasswordInput';
import RadioBtn from '@/components/RadioButton';
import Status from '@/components/Status';
import StatusTag from '@/components/StatusTag';
import { mapActions } from 'vuex';

export default {
	name: 'Users',
	data() {
		return {
			form: {
				firstName: '',
				lastName: '',
				email: '',
				mail: '',
				organisation: '',
				researches: '',
				profession: '',
				password: ''
			},
			loading: false,
			createUser: false,
			filter: false,
			showEditModal: false,
			deactivateModal: false,
			activateModal: false,
			suspendModal: false,
			toggleClass: true,
			statusOption: 'active',
			userInfo: null,
			statusType: [
				{
					value: 'active',
					title: 'Active'
				},
				{
					value: 'suspended',
					title: 'Suspended'
				}
			],
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
					name: 'Email Address',
					sortHeader: 'company'
				},
				{
					name: 'Researched Contact',
					sortHeader: 'research_score'
				},
				{
					name: 'Status',
					sortHeader: ''
				},
				{
					name: 'Research Date'
				},
				{
					name: ' '
				}
			],
			history: [
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					researchNo: '200',
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
					email: 'Kingsley@apple.com',
					researchNo: '20',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 2,
					status: {
						statusCode: 'INACTIVE',
						message: 'Suspended'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Kingsley@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 3,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Lani Juyi',
					email: 'Lani@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 4,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Ayo Wizkid',
					email: 'Wizzy@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 5,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Ayo Wizkid',
					email: 'Wizzy@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 6,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Ayo Wizkid',
					email: 'Wizzy@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 7,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Ayo Wizkid',
					email: 'Wizzy@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 8,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Ayo Wizkid',
					email: 'Wizzy@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 9,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Ayo Wizkid',
					email: 'Wizzy@apple.com',
					researchNo: '200',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 10,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				}
			],
			currentPage: 1,
			totalPages: 5,
			limit: 50,
			page: 1,
			usersLoading: false,
			users: null,
			stat: {
				statusCode: 'ACTIVE',
				message: 'Active'
			},
			userId: null,
			userDetails: [],
			contactToModify: {}
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
		Loader,
		PasswordInput,
		RadioBtn,
		Status,
		StatusTag,
		VButton
	},
	async mounted() {
		//	await this.getAllUSers();
		this.users = [
			{
				_id: '60bdf0ed0ddb1833055e025a',
				role: 'user',
				status: 'active',
				email: 'ayomide@enyata.com',
				profession: 'software engineer',
				organisation: 'Paystack',
				createdAt: '2021-06-07T10:11:57.482Z',
				firstName: 'Ayomide',
				lastName: 'Onigbinde',
				monthlyResearch: 200,
				lastResearchDate: '2021-06-10T08:59:02.469Z'
			},
			{
				_id: '60bdf1260ddb1833055e025b',
				role: 'admin',
				status: 'inactive',
				email: 'oayomide@enyata.com',
				profession: 'Senior Software Engineer',
				organisation: 'Enyata',
				createdAt: '2021-06-07T10:12:54.521Z',
				firstName: 'Jacob',
				lastName: 'Molina',
				monthlyResearch: -1,
				lastResearchDate: '2021-06-10T08:59:02.469Z',
				latests: {
					_id: '60be0f076c4cd6541c8e3e80',
					createdAt: '2021-06-07T12:20:23.681Z',
					updatedAt: '2021-06-07T12:55:29.761Z',
					__v: 0
				}
			}
		];
	},
	methods: {
		...mapActions({
			allUsers: 'users_management/allUsers',
			deactivateUser: 'users_management/deactivateUser',
			activateUser: 'users_management/activateUser',
			suspendUser: 'users_management/suspendUser',
			getSingleUser: 'users_management/singleUser',
			showAlert: 'showAlert'
		}),
		async getAllUSers() {
			this.usersLoading = true;
			try {
				const users = await this.allUsers({ page: this.page, limit: this.limit });
				const { status, data, statusText } = users;
				if (status === 200 && statusText === 'OK') {
					this.users = data.data;
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.usersLoading = false;
			}
		},
		toggleCreateUser() {
			if (!this.createUser) {
				this.createUser = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.createUser = !this.createUser;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		toggleFilterModal() {
			if (!this.filter) {
				this.filter = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.filter = !this.filter;
					this.toggleClass = !this.toggleClass;
				}, 500);
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
		toggleDeactivateModal() {
			if (!this.deactivateModal) {
				this.deactivateModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.deactivateModal = !this.deactivateModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		toggleActivateModal() {
			if (!this.activateModal) {
				this.activateModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.activateModal = !this.activateModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		toggleSuspendModal() {
			if (!this.suspendModal) {
				this.suspendModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.suspendModal = !this.suspendModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		clickCallback(page) {
			this.currentPage = page;
		},
		showUser(item) {
			this.$router.push({ name: 'User', query: { userId: item._id } });
		},
		openEditModal(item) {
			this.userInfo = item;
			this.toggleEditModal();
			console.log(item);
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
		openDeactivateModal(item) {
			const { _id, lastName, firstName } = item;
			this.contactToModify = { ...this.contactToModify, _id, lastName, firstName };
			this.deactivateModal = true;
		},

		async deactivate() {
			try {
				const changeStatus = await this.deactivateUser(this.contactToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					console.log(changeStatus);
					console.log(changeStatus.data.message);
					await this.getAllUSers();
					this.toggleDeactivateModal();
					this.contactToModify = {};
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		openActivateModal(item) {
			const { _id, lastName, firstName } = item;
			this.contactToModify = { ...this.contactToModify, _id, lastName, firstName };
			this.activateModal = true;
		},
		async activate() {
			try {
				const changeStatus = await this.activateUser(this.contactToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					console.log(changeStatus);
					console.log(changeStatus.data.message);
					await this.getAllUSers();
					this.toggleActivateModal();
					this.contactToModify = {};
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		openSuspendModal(item) {
			const { _id, lastName, firstName } = item;
			this.contactToModify = { ...this.contactToModify, _id, lastName, firstName };
			this.suspendModal = true;
		},
		async suspend() {
			try {
				const changeStatus = await this.suspendUser(this.contactToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					console.log(changeStatus);
					console.log(changeStatus.data.message);
					await this.getAllUSers();
					this.toggleSuspendModal();
					this.contactToModify = {};
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},

		async fetchUser() {
			this.userLoading = true;
			try {
				this.userDetails = await this.getSingleUser(this.userId);
				console.log(this.userDetails);
				const { status, data, statusText } = this.userDetails;
				if (status === 200 && statusText === 'OK') {
					this.userDetails = data.data;
					console.log(this.userDetails);
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.userLoading = false;
			}
		}
	}
};
