import { ValidationObserver } from 'vee-validate';
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
import EditUser from '@/components/EditUser';

export default {
	name: 'User',
	data() {
		return {
			form: {
				firstName: '',
				email: null,
				password: null
			},
			editModal: false,
			contactModal: false,
			checkedContacts: [],
			loading: false,
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
			history: [
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					company: 'Apple',
					title: 'Design Manager',
					linkedin: 'www.figma.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 1,
					status: {
						statusCode: 'DONE',
						message: 'Done'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: '',
						message: 'Pending'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: 'DONE',
						message: 'Done'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: 'DONE',
						message: 'Done'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: 'DONE',
						message: 'Done'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: '',
						message: 'Pending'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: '',
						message: 'Pending'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: '',
						message: 'Pending'
					}
				},
				{
					name: 'Darlene Robertson',
					email: 'darlene@amazon.com',
					company: 'Apple',
					title: 'Logistics Officer',
					linkedin: 'www.amazon.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 2,
					status: {
						statusCode: '',
						message: 'Pending'
					}
				},
				{
					name: 'Esther Howard',
					email: 'estherhoward@gmail.com',
					company: 'MIT',
					title: 'Content Marketing',
					linkedin: 'www.amsterdam.com',
					score: '80%',
					lastUpdated: '1h',
					rowId: 3,
					status: {
						statusCode: 'DONE',
						message: 'Done'
					}
				}
			],
			activeTab: 'details'
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
		EditUser
	},
	methods: {
		toggleEditModal() {
			this.editModal = !this.editModal;
		},
		toggleUploadContact() {
			this.contactModal = !this.contactModal;
		},
		setActiveTab(evt) {
			switch (evt) {
				case 'details':
					this.activeTab = evt;
					break;
				case 'contacts':
					this.activeTab = evt;
					break;
				case 'settings':
					this.activeTab = evt;
					break;
			}
		},
		backToUsers() {
			this.$router.push({ name: 'Users' });
		}
	}
};
