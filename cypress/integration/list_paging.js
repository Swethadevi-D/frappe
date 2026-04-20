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

	it("paginates through pages and respects page-size selection", () => {
		cy.visit("/desk/todo/view/report");
		cy.clear_filters();

		// initial: page 1 of N, prev/first disabled
		cy.get(".list-paging-area .list-pagination-controls .page-input").should("have.value", "1");
		cy.get(".list-paging-area .btn-pagination[data-action='prev']").should("be.disabled");
		cy.get(".list-paging-area .btn-pagination[data-action='first']").should("be.disabled");

		// next → page 2
		cy.get(".list-paging-area .btn-pagination[data-action='next']").click();
		cy.get(".list-paging-area .page-input").should("have.value", "2");
		cy.get(".list-paging-area .btn-pagination[data-action='prev']").should("not.be.disabled");

		// jump to page 3 via input
		cy.get(".list-paging-area .page-input").clear().type("3").blur();
		cy.get(".list-paging-area .page-input").should("have.value", "3");

		// change page size → page resets to 1
		cy.get('.list-paging-area .btn-group .btn-paging[data-value="100"]').click();
		cy.get(".list-paging-area .page-input").should("have.value", "1");

		// last → disables next/last
		cy.get(".list-paging-area .btn-pagination[data-action='last']").click();
		cy.get(".list-paging-area .btn-pagination[data-action='next']").should("be.disabled");
		cy.get(".list-paging-area .btn-pagination[data-action='last']").should("be.disabled");

		// first → back to page 1
		cy.get(".list-paging-area .btn-pagination[data-action='first']").click();
		cy.get(".list-paging-area .page-input").should("have.value", "1");
	});
});
