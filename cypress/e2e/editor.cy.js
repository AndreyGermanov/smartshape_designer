describe('Shape editor tests', () => {
  const default_png_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAAXNSR0IArs4c6QAABNFJREFUeF7t3UtuE1EQheGTPYAYMECKhAJiBxBBlk4gsIMIRUg8BgwQ2QPoChscp+1+3UfVrT/T2N23T9WXcqfd9on4sZDAQ0mXkp5vFvNJ0htJvywsLvIaTiIfvJFjfyDpraQXkj5v1vRU0rWkC0m3RtYZchkAaVv2hONK0pmkL5JebpbzUdKppBtJ5yBpVySAtMt+CMfPzXIeSQJJu9r82zNA2hThGI7tikDSpjZ39gqQ+kWYggMk9esyuEeA1C3EHBwgqVsbgDTOewkOkDQuGhOkTgHW4ABJnRoxQRrlnAMHSBoVjwlSNvicOEBStlZMkMr5lsABkspFZIKUCbwkDpCUqRkTpFKuNXCApFIxmSB5g66JAyR5a8cEKZxnCxwgKVxUJkiegFviAEmeGjJBCuVoAQdIChWXCbIuWEs4QLKulkyQzPlZxAGSzEVmgiwLNN2rke4h370TcHuz07It5n8W95NkyBQg80PcbbztbbLWcDBJ5teVl1gZMvOEAyQZCs4EmR6iRxwgmV5fJsiKrDzjAMmKwjNBxsPrAQdIxuvMBFmQUU84QLKgAZggh0PrEQdIZiIByHBgPeMAyQwkALkfVgQcIJmIBCB3g4qE4xCS9KnyVi98TmzrfA8DyP8sI+IYQmL93QH5un/ClgDyN6TIOEByBApAwLHbHvyh2MMSHQgNEfufFKMvsiIDAUfMa0CjKHYfEBUIOMbbhIwkRQRC4cdxcOK+SSAaEHBMxwGSYBMEHPNxhEcSZYKAYzmO0EgiAAHHehxhkfQOBBz5cIRE0jOQ/Y+94U14+bCE+cPTKxA+EyofhkNbCoGkRyDgKI8jzMut3oCAox6OEEh6AgKO+ji6R9ILEHC0w9E1kh6AgKM9jm6ReAcCDjs4ukTiGQg47OHoDolXIOCwi6MrJB6BPJb0TtKppBtJ55Ju7fdLyBW6v5joDUjC8UHSE3C4AecaiScg4HBj4t5C3SLxAgQcfnG4PifxAAQc/nG4RWIdCDj6weESiWUg4OgPhzskVoGAo18crpBYBAKO/nG4QWINCDji4HCBxBIQcMTDYR6JFSDgiIvDNBILQMABDrNIWgMBBzj2EzD1tpSWQMABjkMJmEHSCgg4wDGWgAkkLYCAY6w1+L2Zc5LaQMBB889NYH+SvJb0Y+5Glj6+JhBwLK0Sz9tF8l3Sq1pIagEBB02+NoEmSGoAAcfa1uD5Q+ckVSZJaSDgoLlzJ1B1kpQEAo7crcH2qk+SUkDAQTOXTqDKJCkBBBylW4Pt706SS0lnkoqck+QGAg6at3YCDyRdlUKSEwg4arcG+9smUAxJLiDgoFlbJ1AESQ4g4GjdGuy/2CRZCwQcNKe1BLJOkjVAwGGtNVhP9kmyFAg4aEbrCWSZJEuAgMN6a7C+bJNkLpD0vRzpwgzfz0ETeklg1SSZAyShSF9ekyYI3+zkpT1YZ0pgMZKpQMBBo3lPYBGSKUDA4b01WP/ic5IxIOCguXpLYNYkOQYEHL21Bscze5IcAgIOmqn3BCZNkiEg4Oi9NTi+yZNkHwg4aJ5oCRydJLtAwBGtNTje0UmyBQIOmiV6AoOTJAEBR/TW4PgPTpIE5NsGybWkC0m35EUCgRNIk+S9pGeSviYgvwOHwaGTwNEE/gBkj0t7W7ulYgAAAABJRU5ErkJggg==";
  it('Create new shape', () => {
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
            assert.equal(shape_rows[0].querySelector("img").getAttribute("src"),default_png_image,
                "Should contain correct generated PNG image");
            assert.notEqual(options_card.style.display,'none',"Options panel should be hidden by default");
            assert.equal(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
            assert.notEqual(shape_container.style.display,"none","Editor with shape must be visible");
            const svg = Cypress.$("svg[id='shape_0'").toArray()[0];
            assert.isDefined(svg,"Shape svg element should exist");
          })
        })
      })
    });
  })
  it('Destroy shape', () => {
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
            assert.equal(shape_rows[0].querySelector("img").getAttribute("src"),default_png_image,
                "Should contain correct generated PNG image");
            assert.notEqual(options_card.style.display,'none',"Options panel should be hidden by default");
            assert.equal(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
            assert.notEqual(shape_container.style.display,"none","Editor with shape must be visible");
            const svg = Cypress.$("svg[id='shape_0'").toArray()[0];
            assert.isDefined(svg,"Shape svg element should exist");
            cy.get("#shape_0").trigger("contextmenu").then(() => {
              const guid = svg.getAttribute("guid");
              cy.get("#i"+guid+"_delete").click().then(() => {
                assert.equal(options_card.style.display,'none',"Options panel should be hidden after destroy the shape");
                assert.equal(shape_container.style.display, 'none', 'Shapes editor should be hidden after destroy the shape');
                assert.notEqual(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
              })
            })
          })
        })
      })
    });
  })
  it('Add/remove shape figures', () => {
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
            assert.equal(shape_rows[0].querySelector("img").getAttribute("src"),default_png_image,
                "Should contain correct generated PNG image");
            assert.notEqual(options_card.style.display,'none',"Options panel should be hidden by default");
            assert.equal(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
            assert.notEqual(shape_container.style.display,"none","Editor with shape must be visible");
            const svg = Cypress.$("svg[id='shape_0']").toArray()[0];
            assert.isDefined(svg,"Shape svg element should exist");
            cy.get("#editorMenuBtn").click().then(() => {
              const guid = svg.getAttribute("guid");
              cy.get("#add_square").click().then(() => {
                const square = Cypress.$("svg[id='shape_0_child1']").toArray()[0];
                assert.isDefined(square,"Should create square");
                const polygon = square.querySelector("polygon");
                const points = polygon.getAttribute("points").split(" ");
                assert.equal(points.length,4,"Square should have 4 points");
                cy.get("#editorMenuBtn").click().then(() => {
                  cy.get("#add_triangle").click().then(() => {
                    const triangle = Cypress.$("svg[id='shape_0_child2']").toArray()[0];
                    const triangle_guid = triangle.getAttribute("guid");
                    const square_guid = square.getAttribute("guid");
                    assert.isDefined(triangle, "Should create triangle");
                    const polygon = triangle.querySelector("polygon");
                    const points = polygon.getAttribute("points").split(" ");
                    assert.equal(points.length, 3, "Triangle should have 3 points");
                    cy.get("#shape_0").trigger("contextmenu",{force:true}).then(() => {
                      cy.get("#i"+guid+"_delete").click().then(() => {
                        const shape = Cypress.$("svg[id='shape_0']").toArray()[0]
                        assert.isUndefined(shape,"Parent shape should be destroyed")
                        const triangle = Cypress.$("svg[id='shape_0_child2']").toArray()[0]
                        assert.isDefined(triangle,"Triangle should exist after parent shape destroyed");
                        cy.get("#shape_0_child2").trigger("contextmenu",{force:true}).then(() => {
                          cy.get("#i"+triangle_guid+"_delete").click().then(() => {
                            const triangle = Cypress.$("svg[id='shape_0_child2']").toArray()[0]
                            assert.isUndefined(triangle,"Triangle should be destroyed");
                            const square = Cypress.$("svg[id='shape_0_child1']").toArray()[0]
                            assert.isDefined(square,"Square should exist after triangle destroyed");
                            cy.get("#shape_0_child1").trigger("contextmenu",{force:true}).then(() => {
                              cy.get("#i" + square_guid + "_delete").click().then(() => {
                                const square = Cypress.$("svg[id='shape_0_child1']").toArray()[0]
                                assert.isUndefined(square,"Square should be destroyed");
                                assert.equal(options_card.style.display,'none',"Options panel should be hidden after destroy the shape");
                                assert.equal(shape_container.style.display, 'none', 'Shapes editor should be hidden after destroy the shape');
                                assert.notEqual(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
                              })
                            })
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  })
  it("Import shape from JSON", () => {
    cy.visit('http://localhost:5173').then(() => {
      cy.wait(5000).then(() => {
        const shapes_panel = Cypress.$("#shapes_panel").toArray()[0];
        const options_card = Cypress.$("#optionsCard").toArray()[0];
        const shape_container = Cypress.$("#shape_container").toArray()[0];
        const create_new_shape = Cypress.$("#create_new_shape").toArray()[0];
        assert.isDefined(shapes_panel, "Shapes panel should exist");
        assert.equal(options_card.style.display, 'none', "Options panel should be hidden by default");
        assert.equal(shape_container.style.display, 'none', 'Shapes editor should be hidden by default');
        assert.notEqual(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
      })
    })
  })
})
