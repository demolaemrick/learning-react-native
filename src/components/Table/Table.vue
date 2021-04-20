<template>
	<div class="table__wrapper">
		<table class="table" :class="`table--${theme}`">
			<c-table-header :class="`table__header--${theme}`" :headers="tableHeaders" @sortTable="sortBy = $event" />
			<tbody>
				<tr class="table__row" v-for="(item, index) in sortedData" :key="index">
					<slot slot:table-row :item="item"></slot>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script src="./table.js"></script>
<style lang="scss" src="./table.scss"></style>
