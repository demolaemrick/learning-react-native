import CheckBoxes from '.';

export default {
	title: 'Component/CheckBoxes',
	component: { CheckBoxes },
	argTypes: {
		inputName: {
			control: { type: 'text' }
		}
	}
};

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { CheckBoxes },
	template: '<CheckBoxes @change="changeUpdate" v-bind="$props" />',
	methods: {
		changeUpdate() {
			console.log('changes');
		}
	}
});

export const Checkboxes = Template.bind({});

Checkboxes.args = {
	inputName: 'Permissions',
	datas: [
		{
			value: 'generate-email',
			name: 'Generate Email'
		},
		{
			value: 'generate-guns',
			name: 'Generate Guns'
		},
		{
			value: 'send-mail',
			name: 'Send Mail'
		}
	]
};
