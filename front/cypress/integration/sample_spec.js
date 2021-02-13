describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    cy.visit("http://localhost:3000"); // change URL to match your dev URL
    cy.get(".cityinput").type("Zara").click();
  });
});
