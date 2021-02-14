describe("Weather Forescast test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Looks for an existing city with weather data", () => {
    cy.get("[data-cy=input]").type("Zaragoza, Spain").click();

    cy.get("[data-cy=summary]:first").click();

    cy.get("[data-cy=hourly]:first").click();
  });

  it("Looks for an existing city without weather data", () => {
    cy.get("[data-cy=input]").type("Helsinki, Finland").click();

    cy.get("[data-cy=msg]").contains("No forecast data");
  });

  it("Looks for a non existing city in out database", () => {
    cy.get("[data-cy=input]").type("New York, USA").click();

    cy.get("[data-cy=msg]").contains("doesn't exist");
  });
});
