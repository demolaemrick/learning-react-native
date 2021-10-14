// async getResult() {
// 	this.loading = true;
// 	try {
// 		const response = await this.researchedResult({ id: this.$route.query.id, isFromAdmin: this.isFromAdmin });

// 		const { contact_details, company_details, status } = response.data.data;
// 		this.contact_details = contact_details;
// 		this.company_details = company_details;
// 		this.insightStatus = status;
// 		const refactored = this.changeToLegacyResponse(response.data.data);
// 		await this.saveSearchedResult(refactored);
// 		this.insightStatus.statusCode === 'UPDATING' ? this.subscribe() : null;
// 		return true;
// 	} catch (error) {
// 		let err = error.response;
// 		let params = this.$route.params;
// 		if (err.data.status === 'fail') {
// 			if (Object.keys(params).length > 0) {
// 				let urlParams = this.getURLParams(params.data);
// 				this.showAlert({
// 					status: 'caution',
// 					message: `Please try refresh that user with name ${params.name} and try again`,
// 					showAlert: true
// 				});
// 				this.$router.push({ path: `${params.path}${urlParams.toString()}` });
// 			}
// 		}
// 	} finally {
// 		this.loading = false;
// 	}
// }
