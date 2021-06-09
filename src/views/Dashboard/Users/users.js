import { ValidationObserver } from 'vee-validate';
import CButton from '@/components/Button';
import TextInput from '@/components/Input';
import VTable from '@/components/Table';
import VHeader from '@/components/Header/search/Header';
import ToggleDropdown from '@/components/ToggleDropdown';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import PasswordInput from '@/components/Input/PasswordInput';
import RadioBtn from '@/components/RadioButton';
import Status from '@/components/Status';
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
			userDetails: []
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
		Status
	},
	async mounted() {
		await this.getAllUSers();
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
		async deactivate(item) {
			this.userId = item._id;
			try {
				const changeStatus = await this.deactivateUser(this.userId);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					console.log(changeStatus);
					console.log(changeStatus.data.message);
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
					this.fetchUser();
				}
			} catch (error) {
				console.log(error);
			}
		},
		async suspend(item) {
			this.userId = item._id;
			try {
				const changeStatus = await this.suspendUser(this.userId);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					console.log(changeStatus);
					console.log(changeStatus.data.message);
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
					this.fetchUser();
				}
			} catch (error) {
				console.log(error);
			}
		},
		async activate(item) {
			this.userId = item._id;
			try {
				const changeStatus = await this.activateUser(this.userId);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					console.log(changeStatus);
					console.log(changeStatus.data.message);
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
					this.fetchUser();
				}
			} catch (error) {
				console.log(error);
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
