import EmailHookCard from './';

export default {
	title: 'Library/EmailHookCard',
	component: EmailHookCard,
	argTypes: {
		article: {
			control: {}
		}
	}
};

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EmailHookCard },
	template: '<EmailHookCard v-bind="$props" />'
});

export const Default = Template.bind({});

Default.args = {
	article: {
		title: 'Title',
		content: 'Content',
		meta: {
			html: {
				snippet: `
				<div class="box column is-10 is-offset-1">
					<div class="info-text has-text-centered">
					<span class="is-size-base-mobile is-size-4">
						Please give us a few minutes to verify your account details and confirm the order with The Place - Ilupeju.
					</span>
					</div>
				</div>
			  `
			}
		},
		url: 'https://food.jumia.com.ng/order/finishorder/n4ei/n4ei-hw4j'
	}
};
