context("List Paging", () => {
	before(() => {
		cy.login();
		cy.visit("/desk/website");
		return cy
			.window()
			.its("frappe")
			.then((frappe) => {
				return frappe.call("frappe.tests.ui_test_helpers.create_multiple_todo_records");
			});
	});

	it("paginates via page-number buttons and rows-per-page dropdown", () => {
		cy.visit("/desk/todo/view/report");
		cy.clear_filters();

		// page 1 active, prev disabled
		cy.get(".list-paging-area .btn-page-number.active").should("contain.text", "1");
		cy.get(".list-paging-area .btn-pagination[data-action='prev']").should("be.disabled");

		// next → page 2
		cy.get(".list-paging-area .btn-pagination[data-action='next']").click();
		cy.get(".list-paging-area .btn-page-number.active").should("contain.text", "2");
		cy.get(".list-paging-area .btn-pagination[data-action='prev']").should("not.be.disabled");

		// direct click on a page number
		cy.get(".list-paging-area .btn-page-number").contains(/^3$/).click();
		cy.get(".list-paging-area .btn-page-number.active").should("contain.text", "3");

		// change rows-per-page via dropdown → back to page 1
		cy.get(".list-paging-area .page-size-select").select("100");
		cy.get(".list-paging-area .btn-page-number.active").should("contain.text", "1");
	});
});
