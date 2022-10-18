describe('Shapes Panel tests', () => {
  const default_png_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAAXNSR0IArs4c6QAABNFJREFUeF7t3UtuE1EQheGTPYAYMECKhAJiBxBBlk4gsIMIRUg8BgwQ2QPoChscp+1+3UfVrT/T2N23T9WXcqfd9on4sZDAQ0mXkp5vFvNJ0htJvywsLvIaTiIfvJFjfyDpraQXkj5v1vRU0rWkC0m3RtYZchkAaVv2hONK0pmkL5JebpbzUdKppBtJ5yBpVySAtMt+CMfPzXIeSQJJu9r82zNA2hThGI7tikDSpjZ39gqQ+kWYggMk9esyuEeA1C3EHBwgqVsbgDTOewkOkDQuGhOkTgHW4ABJnRoxQRrlnAMHSBoVjwlSNvicOEBStlZMkMr5lsABkspFZIKUCbwkDpCUqRkTpFKuNXCApFIxmSB5g66JAyR5a8cEKZxnCxwgKVxUJkiegFviAEmeGjJBCuVoAQdIChWXCbIuWEs4QLKulkyQzPlZxAGSzEVmgiwLNN2rke4h370TcHuz07It5n8W95NkyBQg80PcbbztbbLWcDBJ5teVl1gZMvOEAyQZCs4EmR6iRxwgmV5fJsiKrDzjAMmKwjNBxsPrAQdIxuvMBFmQUU84QLKgAZggh0PrEQdIZiIByHBgPeMAyQwkALkfVgQcIJmIBCB3g4qE4xCS9KnyVi98TmzrfA8DyP8sI+IYQmL93QH5un/ClgDyN6TIOEByBApAwLHbHvyh2MMSHQgNEfufFKMvsiIDAUfMa0CjKHYfEBUIOMbbhIwkRQRC4cdxcOK+SSAaEHBMxwGSYBMEHPNxhEcSZYKAYzmO0EgiAAHHehxhkfQOBBz5cIRE0jOQ/Y+94U14+bCE+cPTKxA+EyofhkNbCoGkRyDgKI8jzMut3oCAox6OEEh6AgKO+ji6R9ILEHC0w9E1kh6AgKM9jm6ReAcCDjs4ukTiGQg47OHoDolXIOCwi6MrJB6BPJb0TtKppBtJ55Ju7fdLyBW6v5joDUjC8UHSE3C4AecaiScg4HBj4t5C3SLxAgQcfnG4PifxAAQc/nG4RWIdCDj6weESiWUg4OgPhzskVoGAo18crpBYBAKO/nG4QWINCDji4HCBxBIQcMTDYR6JFSDgiIvDNBILQMABDrNIWgMBBzj2EzD1tpSWQMABjkMJmEHSCgg4wDGWgAkkLYCAY6w1+L2Zc5LaQMBB889NYH+SvJb0Y+5Glj6+JhBwLK0Sz9tF8l3Sq1pIagEBB02+NoEmSGoAAcfa1uD5Q+ckVSZJaSDgoLlzJ1B1kpQEAo7crcH2qk+SUkDAQTOXTqDKJCkBBBylW4Pt706SS0lnkoqck+QGAg6at3YCDyRdlUKSEwg4arcG+9smUAxJLiDgoFlbJ1AESQ4g4GjdGuy/2CRZCwQcNKe1BLJOkjVAwGGtNVhP9kmyFAg4aEbrCWSZJEuAgMN6a7C+bJNkLpD0vRzpwgzfz0ETeklg1SSZAyShSF9ekyYI3+zkpT1YZ0pgMZKpQMBBo3lPYBGSKUDA4b01WP/ic5IxIOCguXpLYNYkOQYEHL21Bscze5IcAgIOmqn3BCZNkiEg4Oi9NTi+yZNkHwg4aJ5oCRydJLtAwBGtNTje0UmyBQIOmiV6AoOTJAEBR/TW4PgPTpIE5NsGybWkC0m35EUCgRNIk+S9pGeSviYgvwOHwaGTwNEE/gBkj0t7W7ulYgAAAABJRU5ErkJggg==";

  beforeEach(() => {
    const downloadsFolder = Cypress.config('downloadsFolder')
    cy.task('deleteFile', downloadsFolder+"/new.json")
  })

  it('Should show empty shapes panel', () => {
    cy.visit('http://localhost:5173').then(() => {
      cy.wait(1000).then(() => {
        const shapes_panel = Cypress.$("#shapes_panel").toArray()[0];
        assert.isDefined(shapes_panel,"Shapes panel should exist");
        const shape_rows = shapes_panel.querySelectorAll(".shape_row")
        assert.equal(shape_rows.length,1,"Should be single item in shapes list");
        assert.equal(shape_rows[0].style.display,'none',"Which is a template item that should be hidden")
      })
    });
  })
  it('Add shape', () => {
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
        cy.get("#panelAddBtn").click().then(() => {
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
    });
  })
  it('Delete shape', () => {
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
        cy.get("#panelAddBtn").trigger("mouseover").click({ force: true }).then(() => {
          const shape_rows = shapes_panel.querySelectorAll(".shape_row[id]")
          assert.equal(shape_rows.length,1,"Should add an item to shapes list");
          assert.equal(shape_rows[0].querySelector("img").getAttribute("src"),default_png_image,
              "Should contain correct generated PNG image");
          assert.notEqual(options_card.style.display,'none',"Options panel should be hidden by default");
          assert.equal(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
          assert.notEqual(shape_container.style.display,"none","Editor with shape must be visible");
          const svg = Cypress.$("svg[id='shape_0'").toArray()[0];
          assert.isDefined(svg,"Shape svg element should exist");
          cy.get("#"+shape_rows[0].id+" > span.fa-plus").click({force:true}).then(() => {
            const shape_rows = shapes_panel.querySelectorAll(".shape_row[id]")
            assert.equal(shape_rows.length,0,"Should delete item from shapes list");
            assert.equal(options_card.style.display,'none',"Options panel should be hidden after delete the shape");
            assert.equal(shape_container.style.display, 'none', 'Shapes editor should be hidden after delete the shape');
            assert.notEqual(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
          })
        })
      })
    });
  })
  it('Upload collection', () => {
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
        cy.get("#uploadFile").selectFile("./src/examples/example.json",{force: true}).then(() => {
          cy.wait(5000).then(() => {
            const shape_rows = shapes_panel.querySelectorAll(".shape_row[id]")
            assert.equal(shape_rows.length, 6, "Should add all items to shapes list");
            assert.isTrue(shape_rows[0].classList.contains("selected"),"The first item must be selected");
            assert.notEqual(options_card.style.display,'none',"Options panel should be displayed after upload the json file");
            assert.notEqual(shape_container.style.display, 'none', 'Shapes editor should be displayed after upload the json file');
            assert.equal(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be hidden');
          });
        })
      })
    });
  })
  it('Download collection', () => {
    cy.visit('http://localhost:5173/').then(() => {
      cy.wait(3000).then(() => {
        const shapes_panel = Cypress.$("#shapes_panel").toArray()[0];
        const options_card = Cypress.$("#optionsCard").toArray()[0];
        const shape_container = Cypress.$("#shape_container").toArray()[0];
        const create_new_shape = Cypress.$("#create_new_shape").toArray()[0];
        assert.isDefined(shapes_panel,"Shapes panel should exist");
        assert.equal(options_card.style.display,'none',"Options panel should be hidden by default");
        assert.equal(shape_container.style.display, 'none', 'Shapes editor should be hidden by default');
        assert.notEqual(create_new_shape.style.display, 'none', 'Panel with button "Create New Shape" should be visible');
        const downloadLink = Cypress.$("#downloadLink").toArray()[0];
        downloadLink.href = "";
        cy.get("#panelSaveBtn").click().then(() => {
          assert.equal(downloadLink.href,"http://localhost:5173/","Should not generate downlooad link if no shapes in the list")
          cy.get("#panelAddBtn").click().then(() => {
            cy.wait(2000).then(() => {
              cy.get("#panelSaveBtn").click().then(() => {
                cy.wait(2000).then(() => {
                  cy.readFile("./cypress/downloads/new.json").then((jsonArray) => {
                    assert.equal(jsonArray.length,1,"Should contain saved object to the file")
                    const jsonContent = jsonArray[0];
                    assert.equal(jsonContent.options.id,"shape_0","Should contain shape ID");
                    assert.equal(jsonContent.points.length,3,"Should contain 3 points in saved object");
                  });
                })
              });
            })
          });
        })
      })
    });
  })
})
