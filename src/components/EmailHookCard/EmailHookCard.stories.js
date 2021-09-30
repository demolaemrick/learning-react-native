import EmailHookCard from './';

export default {
	title: 'Library/EmailHookCard',
	component: EmailHookCard
};

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EmailHookCard },
	template: '<EmailHookCard v-bind="$props" />'
});

export const Default = Template.bind({});

Default.args = {
	title: 'Title',
	content: 'Content'
};
