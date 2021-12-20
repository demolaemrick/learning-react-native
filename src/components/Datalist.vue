<template>
	<div>
		<datalist :id="name">
			<option v-for="suggestion in items" :key="suggestion[labelField]" :value="suggestion[labelField]"></option>
		</datalist>
	</div>
</template>

<script>
export default {
	name: 'Datalist',
	props: {
		items: {
			type: Array,
			default: () => []
		},
		labelField: {
			type: String
		},
		name: {
			type: String
		},
		inputId: {
			type: String
		}
	},
	mounted() {
		document.querySelector(`#${this.inputId}`).addEventListener('input', (e) => {
			this.emitSelected(e);
		});
	},
	methods: {
		emitSelected(event) {
			console.log('selected event');
			const value = event.target.value;
			const selected = this.items.find((item) => {
				return item[this.labelField] === value;
			});

			if (!selected) {
				return;
			}

			this.$emit('selected', selected);
		}
	}
};
</script>
