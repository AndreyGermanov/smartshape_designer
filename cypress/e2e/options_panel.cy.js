describe('Options Panel tests', () => {
  it('Should display option panel when shape is added', () => {
    cy.visit('http://localhost:5173').then(() => {
      cy.wait(5000).then(() => {
        const shapes_panel = Cypress.$("#shapes_panel").toArray()[0];
        const options_card = Cypress.$("#optionsCard").toArray()[0];
        const shape_container = Cypress.$("#shape_container").toArray()[0];
        const create_new_shape = Cypress.$("#create_new_shape").toArray()[0];
        assert.isDefined(shapes_panel,"Shapes panel should exist");
        assert.equal(options_card.style.display,'none',"Options panel should be hidden by default");
        assert.equal(shape_container.style.display, 'none', 'Shapes editor should be hidden by default');
        assert.notEqual(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
        cy.get("#newBtn").click().then(() => {
          cy.wait(2000).then(() => {
            const shape_rows = shapes_panel.querySelectorAll(".shape_row[id]")
            assert.equal(shape_rows.length,1,"Should add an item to shapes list");
            assert.notEqual(options_card.style.display,'none',"Options panel should be hidden by default");
            assert.equal(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
            assert.notEqual(shape_container.style.display,"none","Editor with shape must be visible");
            const svg = Cypress.$("svg[id='shape_0']").toArray()[0];
            assert.isDefined(svg,"Shape svg element should exist for first shape");
            const shapeIdInput = Cypress.$("#optionsPanel #id").toArray()[0];
            assert.equal(shapeIdInput.value,"shape_0","Should have shape ID in value")
            cy.get("#panelAddBtn").click().then(() => {
              const svg = Cypress.$("svg[id='shape_1']").toArray()[0];
              assert.isDefined(svg,"Shape svg element should exist for second shape");
              assert.equal(shapeIdInput.value,"shape_1",
                  "Value in 'ID' input field should change according to new shape");
            })
          });
        });
      });
    });
  })
  it('Should change the shape according to options change', () => {
    cy.visit('http://localhost:5173').then(() => {
      cy.wait(5000).then(() => {
        const shapes_panel = Cypress.$("#shapes_panel").toArray()[0];
        const options_card = Cypress.$("#optionsCard").toArray()[0];
        const shape_container = Cypress.$("#shape_container").toArray()[0];
        const create_new_shape = Cypress.$("#create_new_shape").toArray()[0];
        assert.isDefined(shapes_panel,"Shapes panel should exist");
        assert.equal(options_card.style.display,'none',"Options panel should be hidden by default");
        assert.equal(shape_container.style.display, 'none', 'Shapes editor should be hidden by default');
        assert.notEqual(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
        cy.get("#newBtn").click().then(() => {
          cy.wait(2000).then(() => {
            const shape_rows = shapes_panel.querySelectorAll(".shape_row[id]")
            assert.equal(shape_rows.length,1,"Should add an item to shapes list");
            assert.notEqual(options_card.style.display,'none',"Options panel should be hidden by default");
            assert.equal(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
            assert.notEqual(shape_container.style.display,"none","Editor with shape must be visible");
            const svg = Cypress.$("svg[id='shape_0']").toArray()[0];
            assert.isDefined(svg,"Shape svg element should exist for first shape");
            const shapeIdInput = Cypress.$("#optionsPanel #id").toArray()[0];
            assert.equal(shapeIdInput.value,"shape_0","Should have shape ID in value")
            shapeIdInput.value = "";
            cy.get("#optionsPanel #id").type("shape_2").then(() => {
              let svg = Cypress.$("svg[id='shape_0']").toArray()[0];
              assert.isUndefined(svg,"Previous ID should stop working after change");
              svg = Cypress.$("svg[id='shape_2']").toArray()[0];
              assert.isDefined(svg,"Shape svg element should exist by new ID");
              const shapeWidthInput = Cypress.$("#optionsPanel #width").toArray()[0];
              shapeWidthInput.value = "";
              cy.get("#optionsPanel #width").type("400").then(() => {
                assert.equal(svg.getAttribute("width"),"400",
                    "Should change width of shape according to width input value");
              });
            })
          });
        });
      });
    });
  })
})
