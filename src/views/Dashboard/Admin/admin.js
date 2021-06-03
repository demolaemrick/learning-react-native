import { ValidationObserver } from 'vee-validate';
import CButton from '@/components/Button';
import TextInput from '@/components/Input';
import VTable from '@/components/Table';
import VHeader from '@/components/Header/search/Header';
import ToggleDropdown from '@/components/ToggleDropdown';
import Modal from '@/components/Modal';
import Status from '@/components/Status';
import Toggle from '@/components/Toggle';
import InputTag from '@/components/InputTag';

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
			emailList: []
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
		InputTag
	},
	methods: {
		toggleSendInvites() {
			this.sendInvites = !this.sendInvites;
		},
		// toggleInfoModal() {
		// 	this.editModal = !this.editModal;
		// },
		openEditModal() {
			console.log('jhbfjhdbjaf');
			this.editModal = !this.editModal;
		},
		addEmail() {
			this.emailList.push(this.emailInput);
			this.emailInput = '';
		},
		deleteEmail(index) {
			const list = this.emailList;
			list.splice(index, 1);
		}
	}
};
