import { ValidationObserver } from 'vee-validate';
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
import { mapActions, mapGetters } from 'vuex';
import debounce from 'lodash.debounce';
import CheckBoxes from '@/components/CheckBoxes';

import globalMixins from '@/mixins/globalMixins';

export default {
	name: 'Users',
	mixins: [globalMixins],
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
			loading: false,
			createUser: false,
			filter: false,
			showEditModal: false,
			deactivateModal: false,
			activateModal: false,
			suspendModal: false,
			toggleClass: true,
			statusOption: '',
			userInfo: null,
			statusType: [
				{
					value: 'active',
					title: 'Active'
				},
				{
					value: 'inactive',
					title: 'Inactive'
				},
				{
					value: 'suspended',
					title: 'Suspended'
				}
			],
			tableHeaders: [
				{
					name: 'Name',
					sortHeader: 'full_name'
				},
				{
					name: 'Email Address',
					sortHeader: 'company'
				},
				{
					name: 'Research Count',
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
			showEditPermission: false,
			currentPage: 0,
			total: 0,
			limit: 10,
			page: 1,
			count: 0,
			nextPage: null,
			usersLoading: false,
			users: [],
			stat: {
				statusCode: 'ACTIVE',
				message: 'Active'
			},
			userId: null,
			userDetails: [],
			contactToModify: {},
			searchQuery: '',
			filterData: '',
			permissions: [],
			checkedPermissions: []
		};
	},
	props: {
		modalName: String
	},
	components: {
		ValidationObserver,
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
		VButton,
		CheckBoxes
	},
	mounted() {
		this.usersLoading = true;
		this.getAllUsers();
	},
	computed: {
		...mapGetters({
			getLoggedUser: 'auth/getLoggedUser'
		})
	},
	methods: {
		...mapActions({
			allUsers: 'users_management/allUsers',
			deactivateUser: 'users_management/deactivateUser',
			activateUser: 'users_management/activateUser',
			adminPermissions: 'admin_management/adminPermissions',
			saveAdminPermissions: 'admin_management/saveAdminPermissions',
			suspendUser: 'users_management/suspendUser',
			getSingleUser: 'users_management/singleUser',
			updateUser: 'users_management/updateUser',
			createNewUser: 'users_management/createUser',
			search: 'users_management/search',
			showAlert: 'showAlert'
		}),

		async getAllUsers() {
			try {
				const users = await this.allUsers({ page: this.page, limit: this.limit });
				const { status, data, statusText } = users;
				if (status === 200 && statusText === 'OK') {
					this.users = data.response.data;
					this.count = data.response.count;
					this.currentPage = data.response.currentPage;
					this.total = Math.ceil(data.response.count / this.limit);
					this.nextPage = data.response.nextPage;
				}
				const resp = await this.adminPermissions({
					type: 'user'
				});
				// console.log(resp);
				const { status: pStatus, data: pData, statusText: pStatusText } = resp;
				if (pStatus === 200 && pStatusText === 'OK') {
					let permissionsData = pData.data;

					this.permissions = permissionsData.map((res, index) => {
						let value = res.split('-').join(' ');
						value = `${value[0].toUpperCase()}${value.slice(1)}`;
						return {
							id: index + 1,
							name: value,
							value: res
						};
					});
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.usersLoading = false;
			}
		},
		async savePermission() {
			const userId = this.userInfo._id;
			let permissions = this.checkedPermissions;

			let mainPermissions = this.permissions.map((res) => res.value);
			permissions = this.compareArray(mainPermissions, permissions);

			this.loading = true;

			let data = {
				permissions,
				userId
			};

			try {
				const response = await this.saveAdminPermissions(data);
				this.loading = false;
				// return;
				if (response.status === 201) {
					this.showAlert({
						status: 'success',
						message: response.data.message,
						showAlert: true
					});
					this.users = this.users.map((res) => {
						if (res._id === userId) {
							res.permissions = permissions;
						}
						return res;
					});
					this.toggleModalClass('showEditPermission');
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
				// this.checkedPermissions = [];
			}
		},
		clickCallback(page) {
			this.page = page;
			this.getAllUsers();
		},
		clearFilter() {
			this.filterData = '';
			this.statusOption = '';
			this.toggleModalClass('filter');
			this.getAllUsers();
		},
		async registerUser() {
			this.loading = true;
			try {
				const response = await this.createNewUser(this.form);
				const { status, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					await this.getAllUsers();
					this.toggleModalClass('createUser');
					this.form = {};
					this.showAlert({
						status: 'success',
						message: response.data.message || 'User created successfully',
						showAlert: true
					});
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message || 'Whoops! User not created',
					showAlert: true
				});
			} finally {
				this.loading = false;
			}
		},
		openEditPermissionModal(item) {
			this.userInfo = item;
			this.checkedPermissions = item.permissions;
			this.toggleModalClass('showEditPermission');
		},
		toggleModalClass(modal) {
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
		showUser(item) {
			this.$router.push({ name: 'User', query: { userId: item._id } });
		},
		openEditModal(item) {
			this.userInfo = item;
			this.toggleModalClass('showEditModal');
		},
		async editUser() {
			this.loading = true;
			const { first_name, last_name, role, monthly_research, organisation, profession } = this.userInfo;
			try {
				const response = await this.updateUser({
					id: this.userInfo._id,
					user: { first_name, last_name, role, monthly_research, organisation, profession }
				});
				const { status, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					this.toggleModalClass('showEditModal');
					this.getAllUsers();
					this.showAlert({
						status: 'success',
						message: response.data.message || 'user successfully updated',
						showAlert: true
					});
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

		openDeactivateModal(item) {
			const { _id, last_name, first_name } = item;
			this.contactToModify = { ...this.contactToModify, _id, last_name, first_name };
			this.deactivateModal = true;
		},
		async deactivate() {
			this.loading = true;
			try {
				const changeStatus = await this.deactivateUser(this.contactToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleModalClass('deactivateModal');

					await this.getAllUsers();
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
			} finally {
				this.loading = false;
			}
		},
		openActivateModal(item) {
			const { _id, last_name, first_name } = item;
			this.contactToModify = { ...this.contactToModify, _id, last_name, first_name };
			this.activateModal = true;
		},
		async activate() {
			this.loading = true;
			try {
				const changeStatus = await this.activateUser(this.contactToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleModalClass('activateModal');
					await this.getAllUsers();
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
			} finally {
				this.loading = false;
			}
		},
		openSuspendModal(item) {
			const { _id, last_name, first_name } = item;
			this.contactToModify = { ...this.contactToModify, _id, last_name, first_name };
			this.suspendModal = true;
		},
		async suspend() {
			this.loading = true;
			try {
				const changeStatus = await this.suspendUser(this.contactToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleModalClass('suspendModal');
					await this.getAllUsers();
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
			} finally {
				this.loading = false;
			}
		},

		async searchPage(payload) {
			try {
				const response = await this.search(payload);
				let { data } = response;
				if (data.response.data.length > 0) {
					this.users = response.data.response.data;
					this.count = data.response.count;
					this.currentPage = data.response.currentPage;
					this.total = Math.ceil(data.response.count / this.limit);
					this.nextPage = data.response.nextPage;
				} else {
					this.users = [];
				}
			} catch (error) {
				console.log(error);
			} finally {
				if (this.filter === true) {
					this.toggleModalClass('filter');
				}
			}
		},
		clearSearch() {
			this.searchQuery = '';
		},
		checkUpdate(value) {
			this.checkedPermissions = value;
		}
	},
	watch: {
		searchQuery: debounce(function(newVal) {
			if (newVal) {
				this.searchPage({ q: newVal });
			} else {
				this.getAllUsers();
				this.usersLoading = true;
			}
		}, 600)
	}
};
