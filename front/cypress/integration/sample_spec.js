describe("Weather Forescast test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  // it("Looks for an existing city", () => {
  //   cy.get("[data-cy=input]").type("Zaragoza, Spain").click();

  //   cy.get("[data-cy=summary]:first").click();

  //   cy.get("[data-cy=hourly]:first").click();
  // });

  it("Looks for the forecast in 5 days", () => {
    cy.get("[data-cy=input]").type("Zaragoza, Spain").click();

    cy.get("[data-cy=summary]").eq(5).click();
  });
});
