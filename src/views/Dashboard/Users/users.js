import { ValidationObserver } from 'vee-validate';
import CButton from '@/components/Button';
import TextInput from '@/components/Input';
import VTable from '@/components/Table';
import VHeader from '@/components/Header/search/Header';
import ToggleDropdown from '@/components/ToggleDropdown';
import UserModal from '@/components/UserDashboardModal';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import PasswordInput from '@/components/Input/PasswordInput';
import RadioBtn from '@/components/RadioButton';
import Status from '@/components/Status';

export default {
	name: 'Users',
	data() {
		return {
			form: {
				firstName: '',
				email: '',
				password: ''
			},
			loading: false,
			createUser: false,
			filter: false,
			editModal: false,
			statusOption: 'active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
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
					status: 'Active',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 10,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				}
			]
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
		UserModal,
		Modal,
		Loader,
		PasswordInput,
		RadioBtn,
		Status
	},
	methods: {
		toggleCreateUser() {
			this.createUser = !this.createUser;
		},
		toggleFilterModal() {
			this.filter = !this.filter;
		}
		// toggleEditModal() {
		// 	this.editModal = !this.editModal;
		// }
	}
};
