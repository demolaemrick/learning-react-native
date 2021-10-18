import { ValidationObserver } from 'vee-validate';
import { mapActions, mapGetters } from 'vuex';
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
import VButton from '@/components/Button';
import debounce from 'lodash.debounce';
import CheckBoxes from '@/components/CheckBoxes';

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
			emailInput: null,
			loading: false,
			sendInvites: false,
			deactivateModal: false,
			activateModal: false,
			suspendModal: false,
			tableHeaders: [
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
			emailList: [],
			showEditModal: false,
			showEditPermission: false,
			toggleClass: true,
			adminLoading: false,
			currentPage: 1,
			totalPages: 5,
			limit: 10,
			page: 1,
			total: 0,
			count: 0,
			nextPage: null,
			admins: null,
			adminInfo: {},
			currentAdmin: {},
			adminId: null,
			searchQuery: null,
			adminToModify: {},
			roles: ['User', 'Admin', 'Super Admin'],
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
		Status,
		Toggle,
		InputTag,
		Loader,
		StatusTag,
		VButton,
		CheckBoxes
	},
	mounted() {
		this.getAdmins();
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		})
	},
	methods: {
		...mapActions({
			adminInvite: 'admin_management/adminInvite',
			allAdmins: 'admin_management/allAdmins',
			adminPermissions: 'admin_management/adminPermissions',
			saveAdminPermissions: 'admin_management/saveAdminPermissions',
			deactivateAdmin: 'admin_management/deactivateAdmin',
			activateAdmin: 'admin_management/activateAdmin',
			suspendAdmin: 'admin_management/suspendAdmin',
			updateAdmin: 'admin_management/updateAdmin',
			adminSearch: 'admin_management/adminSearch',
			showAlert: 'showAlert'
		}),
		async getAdmins() {
			this.adminLoading = true;
			try {
				const response = await this.allAdmins({ page: this.page, limit: this.limit });
				const { status, data, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					this.admins = data.data.data;
					this.count = data.data.count;
					this.currentPage = data.data.currentPage;
					this.total = Math.ceil(data.data.count / this.limit);
					this.nextPage = data.data.nextPage;
				}
				const resp = await this.adminPermissions({ type: 'admin' });
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
				this.adminLoading = false;
			}
		},
		async inviteAdmin() {
			this.loading = true;
			// if (this.emailInput.length === 0) {
			// 	this.emailList.push(this.emailInput);
			// 	this.emailInput = '';
			// }
			try {
				const response = await this.adminInvite({ email: this.emailList });
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Invite sent Successfully',
						showAlert: true
					});
					this.emailList = [];
					this.toggleModalClass('sendInvites');
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
		async savePermission() {
			const userId = this.adminInfo._id;
			const permissions = this.checkedPermissions;

			this.loading = true;

			let data = {
				permissions,
				userId
			};
			// console.log(data);

			try {
				const response = await this.saveAdminPermissions(data);
				// console.log(response);
				this.loading = false;
				// return;
				if (response.status === 201) {
					this.showAlert({
						status: 'success',
						message: response.data.message,
						showAlert: true
					});
					this.admins = this.admins.map((res) => {
						if (res._id === userId) {
							res.permissions = permissions;
						}
						return res;
					});
					// this.toggleModalClass('showEditPermission');
					return true;
				}
			} catch (error) {
				console.log(error.response);
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
		openEditModal(item) {
			this.adminInfo = item;
			this.toggleModalClass('showEditModal');
		},
		openEditPermissionModal(item) {
			this.adminInfo = item;
			// console.log(item);
			this.checkedPermissions = item.permissions;
			// console.log(item);
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
		addEmail(e) {
			if (this.emailInput && e.target.validity.valid) {
				this.emailList.push(this.emailInput);
				this.emailInput = '';
			}
		},
		deleteEmail(index) {
			const list = this.emailList;
			list.splice(index, 1);
		},
		clickCallback(page) {
			this.currentPage = page;
		},
		openDeactivateModal(item) {
			const { _id, last_name, first_name } = item;
			this.adminToModify = { ...this.adminToModify, _id, last_name, first_name };
			this.deactivateModal = true;
		},
		async deactivate() {
			this.loading = true;
			try {
				const changeStatus = await this.deactivateAdmin(this.adminToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleModalClass('deactivateModal');
					await this.getAdmins();
					this.adminToModify = {};
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
			this.adminToModify = { ...this.adminToModify, _id, last_name, first_name };
			this.activateModal = true;
		},
		async activate() {
			this.loading = true;
			try {
				const changeStatus = await this.activateAdmin(this.adminToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleModalClass('activateModal');
					await this.getAdmins();
					this.adminToModify = {};
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
			this.adminToModify = { ...this.adminToModify, _id, last_name, first_name };
			this.suspendModal = true;
		},
		async suspend() {
			this.loading = true;
			try {
				const changeStatus = await this.suspendAdmin(this.adminToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleModalClass('suspendModal');
					await this.getAdmins();
					this.adminToModify = {};
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
		async editAdmin() {
			this.loading = true;
			const { first_name, last_name, role, monthly_research, organisation, profession } = this.adminInfo;
			try {
				const response = await this.updateAdmin({
					id: this.adminInfo._id,
					admin: { first_name, last_name, role, monthly_research, organisation, profession }
				});
				const { status, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					await this.getAdmins();
					this.toggleModalClass('showEditModal');
					this.showAlert({
						status: 'success',
						message: 'user successfully updated',
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
			console.log(this.searchQuery);
			try {
				const response = await this.adminSearch(payload);
				if (response.data.response.data.length > 0) {
					this.admins = response.data.response.data;
				} else {
					this.showAlert({
						status: 'caution',
						message: 'No admin found',
						showAlert: true
					});
				}
			} catch (error) {
				console.log(error);
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
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
		searchQuery: debounce(function (newVal) {
			if (newVal) {
				this.searchPage({ q: newVal });
			} else {
				this.getAdmins();
			}
		}, 600)
	}
};
