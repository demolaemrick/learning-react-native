<template>
	<div>
		<svg v-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<g transform="translate(-2 -2)" fill="none" fill-rule="evenodd">
				<path d="M0 0h24v24H0z" />
				<circle cx="12" cy="12" r="10" fill="#76A9FA" />
				<rect width="2" height="7" x="11" y="10" fill="#FFF" rx="1" />
				<rect width="2" height="2" x="11" y="7" fill="#FFF" rx="1" />
			</g>
		</svg>
		<svg v-if="type === 'caution'" xmlns="http://www.w3.org/2000/svg" width="21" height="17">
			<g transform="translate(-2 -4)" fill="none" fill-rule="evenodd">
				<path d="M0 0h24v24H0z" />
				<path
					fill="#E3A008"
					d="M11.167 4.5L2.825 19.513a1 1 0 00.875 1.486h17.517a1 1 0 00.853-1.521L12.894 4.464a.999.999 0 00-1.727.035z"
				/>
				<rect width="2" height="7" x="11" y="9" fill="#FFF" rx="1" />
				<rect width="2" height="2" x="11" y="17" fill="#FFF" rx="1" />
			</g>
		</svg>
		<svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<g transform="translate(-2 -2)" fill="none" fill-rule="evenodd">
				<path d="M0 0h24v24H0z" />
				<circle cx="12" cy="12" r="10" fill="#33C48D" />
				<path
					fill="#FFF"
					fill-rule="nonzero"
					d="M16.769 7.818a1 1 0 011.463 1.364l-7 7.5a1.001 1.001 0 01-1.383.077l-3.5-3a.999.999 0 111.302-1.518l2.772 2.376 6.346-6.8z"
				/>
			</g>
		</svg>
		<svg v-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<g transform="translate(-2 -2)" fill="none" fill-rule="evenodd">
				<path d="M0 0h24v24H0z" />
				<circle cx="12" cy="12" r="10" fill="#F97F7F" />
				<path
					fill="#FFF"
					d="M9.207 7.793l2.828 2.827 2.829-2.827a1 1 0 011.414 1.414l-2.828 2.828 2.828 2.829a1 1 0 01-1.414 1.414l-2.829-2.828-2.828 2.828a1 1 0 01-1.414-1.414l2.827-2.829-2.827-2.828a1 1 0 011.414-1.414z"
				/>
			</g>
		</svg>
	</div>
</template>

<script>
export default {
	name: 'AlertIcon',
	props: {
		type: {
			type: String,
			required: true
		}
	}
};
</script>
