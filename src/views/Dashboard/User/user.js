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
import EditUser from '@/components/EditUser';
import FileUpload from 'vue-upload-component';

export default {
	name: 'User',
	data() {
		return {
			form: {
				firstName: '',
				email: null,
				password: null
			},
			showEditModal: false,
			contactModal: false,
			checkedContacts: [],
			loading: false,
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
			activeTab: 'details',
			accept: 'csv',
			extensions: 'csv',
			files: [],
			csvImport: {
				contacts: null,
				is_csv: true
			}
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
		EditUser,
		FileUpload
	},
	methods: {
		...mapActions({
			showAlert: 'showAlert'
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
					break;
				case 'settings':
					this.activeTab = evt;
					break;
			}
		},
		checkAll(event) {
			if (event.target.checked) {
				this.history.forEach((item) => {
					// console.log(item);
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
			console.log(this.csvImport.contacts);
		}
	}
};
