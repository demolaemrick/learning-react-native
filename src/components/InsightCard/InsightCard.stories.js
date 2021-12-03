import InsightCard from './';

export default {
	title: 'Library/InsightCard',
	component: InsightCard,
	argTypes: {
		article: {
			control: {}
		}
	}
};

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { InsightCard },
	template: '<InsightCard v-bind="$props" />'
});

export const Default = Template.bind({});

Default.args = {
	article: {
		title: 'Title',
		content: 'Content',
		quote: 'Quote',
		url: 'https://food.jumia.com.ng/order/finishorder/n4ei/n4ei-hw4j'
	}
};
