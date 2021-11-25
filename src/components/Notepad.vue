<template>
	<div class="notepad">
		<span class="title-wrapper">
			<p class="notepad-title">
				<span>Notepad</span>
				<small class="loader_container">
					<Loader v-if="sending" color="#3B48F7" />
				</small>
			</p>
			<img
				src="@/assets/icons/collapse.svg"
				alt="close notepad icon"
				svg-inline
				v-if="hideSearch"
				@click="[$emit('editNoteF'), (hideSearch = false)]"
			/>
		</span>
		<textarea
			class="notepad-input"
			:class="{ active: activeTetxArea }"
			:rows="rows"
			cols="50"
			name="text"
			v-model="notepadTXT"
			@focus="expandNotepad"
			@blur="handleTextarea"
			id="textArea"
			:placeholder="placeholder"
		>
		</textarea>
	</div>
</template>

<script>
import Loader from './Loader';
export default {
	name: 'Notepad',
	components: {
		Loader
	},
	props: {
		handleTextareaBlur: {
			type: Function
		},
		sending: {
			type: Boolean
		},
		placeholder: {
			type: String,
			default: 'Write down findings from research.'
		},
		notepadtxt: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			notepadTXT: '',
			activeTetxArea: false,
			hideSearch: false,
			rows: 1
		};
	},
	mounted() {
		this.notepadTXT = this.notepadtxt;
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 10) : (this.rows = 1);
		}
	},
	methods: {
		expandNotepad() {
			this.hideSearch = true;
			this.activeTetxArea = true;
		},
		handleTextarea() {
			this.activeTetxArea = false;
			if (this.notepadTXT.toLowerCase() !== this.notepadtxt.toLowerCase()) {
				this.handleTextareaBlur(this.notepadTXT);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.notepad {
	padding: 15px 24px;
	background-color: #fafafa;

	&-title {
		font-weight: bold;
		font-size: 17px;
		line-height: 20px;
		letter-spacing: -0.453333px;
		color: #333758;
		margin-bottom: 8px;
		display: flex;
		align-items: center;
	}
	.title-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		svg {
			cursor: pointer;
			color: #3b48f7;
		}

		& .loader_container {
			display: block;
			width: 5px;
		}
	}
	&-input {
		width: 100%;
		background-color: transparent;
		border: none;
		resize: none;
		margin-top: 1rem;

		&.active {
			border: 1px solid #3b48f7;
			padding: 15px;
			border-radius: 6px;
			-webkit-border-radius: 6px;
			-moz-border-radius: 6px;
			-ms-border-radius: 6px;
			-o-border-radius: 6px;
		}

		transition: all 0.3s ease-in-out;
		-webkit-transition: all 0.3s ease-in-out;
		-moz-transition: all 0.3s ease-in-out;
		-ms-transition: all 0.3s ease-in-out;
		-o-transition: all 0.3s ease-in-out;
	}

	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
	transition: all 0.5s ease-in-out;
	-webkit-transition: all 0.5s ease-in-out;
	-moz-transition: all 0.5s ease-in-out;
	-ms-transition: all 0.5s ease-in-out;
	-o-transition: all 0.5s ease-in-out;
}
</style>
