import {stringToStyles} from "../../src/utils/css.js";

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
  it('Fill tab', () => {
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
            let svg = Cypress.$("svg[id='shape_0']").toArray()[0];
            let polygon = svg.querySelector("polygon");
            assert.isDefined(svg,"Shape svg element should exist for first shape");
            assert.isDefined(polygon,"Shape polygon element should exist for first shape");
            const fillTab = Cypress.$("#fill").toArray()[0];
            const fillColor = fillTab.querySelector("#fillTypeColor");
            const fillGradient = fillTab.querySelector("#fillTypeGradient");
            const fillImage = fillTab.querySelector("#fillTypeImage");
            const fillColorInput = fillTab.querySelector("#fillTypeColorInput")
            assert.isFalse(fillTab.classList.contains("active"),"Should be hidden by default");
            cy.get("#fill_tab").click().then(() => {
              assert.isTrue(fillTab.classList.contains("active"),"Should show Fill tab on click");
              let fillType = fillTab.querySelector("#fillType");
              let fillTypeOption = fillType.querySelector("option[selected]");
              assert.equal(fillType.value,"none","Fill type must be 'none' by default");
              assert.equal(fillTypeOption.value,"none","'None' fill type must be selected from dropdown");
              assert.equal(fillColor.style.display,'none',"Color input field should be hidden");
              cy.get("#fillType").select("color").then(() => {
                fillType = fillTab.querySelector("#fillType");
                let fillTypeOptions = fillType.querySelectorAll("option");
                fillTypeOption = Array.from(fillTypeOptions).find(option => option.selected);
                assert.equal(fillType.value,"color","Fill type must be 'color' after select");
                assert.equal(fillTypeOption.value,"color","'Color' fill type must be selected from dropdown");
                assert.equal(fillColor.style.display,'',"Color input field should appear");
                fillColorInput.value = "";
                cy.get("#fillTypeColorInput").type("#ff0000ff").then(() => {
                  assert.equal(fillColorInput.style.backgroundColor,'rgb(255, 0, 0)',
                      "Background color of input field should change to red");
                  svg = Cypress.$("svg[id='shape_0']").toArray()[0];
                  polygon = svg.querySelector("polygon");
                  assert.equal(polygon.style.fill,'rgb(255, 0, 0)',
                      "Polygon background color should change to red");
                  let cssTextArea = Cypress.$("#cssTextArea").toArray()[0];
                  let styles = stringToStyles(cssTextArea.value);
                  assert.equal(styles.fill,"#ff0000ff","Should set fill style on CSS tab to selected color");
                  cy.get("#fillType").select("gradient").then(() => {
                    fillType = fillTab.querySelector("#fillType");
                    let fillTypeOptions = fillType.querySelectorAll("option");
                    fillTypeOption = Array.from(fillTypeOptions).find(option => option.selected);
                    assert.equal(fillType.value,"gradient","Fill type must be 'color' after select");
                    assert.equal(fillTypeOption.value,"gradient","'Color' fill type must be selected from dropdown");
                    assert.equal(fillColor.style.display,'none',"Color input field should disappear");
                    assert.equal(fillGradient.style.display,'',"Fill gradient setup panel should appear");
                    const fillGradientType = fillGradient.querySelector("#fillGradientType");
                    let fillGradientOptions = fillGradientType.querySelectorAll("option");
                    let fillGradientOption = Array.from(fillGradientOptions).find(option => option.selected)
                    svg = Cypress.$("svg[id='shape_0']").toArray()[0];
                    polygon = svg.querySelector("polygon");
                    assert.equal(fillGradientType.value,"linear","Should be linear gradient by default");
                    assert.equal(fillGradientOption.value, "linear", "'Linear' should be selected in dropdown");
                    let gradientRows = Array.from(fillGradient.querySelectorAll("tr[id]")).filter(row=>row.style.display!=='none')
                    assert.equal(gradientRows.length,0,"Number of rows in gradient table should be 0 by default");
                    cy.wait(110).then(() => {
                      let styles = stringToStyles(cssTextArea.value);
                      assert.equal(styles.fill,"#gradient","Should set fill style on CSS tab to #gradient");
                      cy.get("#fillGradientAddBtn").click().then(() => {
                        let gradientRows = Array.from(fillGradient.querySelectorAll("tr[id]")).filter(row=>row.style.display!=='none')
                        assert.equal(gradientRows.length,1,"Should add a row to gradient table");
                        let gradientRow = gradientRows[0];
                        let percentInput = gradientRow.querySelector("input[type='number']");
                        percentInput.value = 1;
                        let colorInput = gradientRow.querySelector("input.color");
                        colorInput.value = "";
                        cy.get("#step_stopColor_1").type("#ff0000ff").then(() => {
                          const gradTransform = fillGradient.querySelector("#fillGradientAngle")
                          gradTransform.value = "";
                          cy.get("#fillGradientAngle").type("90").then(() => {
                            svg = Cypress.$("svg[id='shape_0']").toArray()[0];
                            const gradient = svg.querySelector("linearGradient");
                            assert.equal(gradient.getAttribute("gradientTransform"),"rotate(90)",
                                "Gradient rotation should be applied correctly");
                            const steps = Array.from(gradient.querySelectorAll("stop"));
                            assert.equal(steps.length,1,"Number of gradient steps should be correct");
                            assert.equal(steps[0].getAttribute("offset"),"1%","Should set correct percent");
                            assert.equal(steps[0].getAttribute("stop-color"),"#ff0000ff","Should set correct stop color");
                            cy.get("#fill_gradient_step_0 button").click().then(() => {
                              let gradientRows = Array.from(fillGradient.querySelectorAll("tr[id]")).filter(row=>row.style.display!=='none')
                              assert.equal(gradientRows.length,0,"Should remove row from gradient table");
                              svg = Cypress.$("svg[id='shape_0']").toArray()[0];
                              const gradient = svg.querySelector("linearGradient");
                              const steps = Array.from(gradient.querySelectorAll("stop"));
                              assert.equal(steps.length,0,"Should remove gradient step");
                              cy.get("#fillType").select("image").then(() => {
                                assert.equal(fillGradient.style.display,'none',"Should hide gradient panel");
                                assert.equal(fillImage.style.display,'',"Should show image panel");
                                cy.wait(110).then(() => {
                                  let styles = stringToStyles(cssTextArea.value);
                                  assert.equal(styles.fill,"#image","Should switch fill property on CSS tab to '#image'");
                                  cy.get("#fillType").select("none").then(() => {
                                    assert.equal(fillGradient.style.display,'none',"Should hide gradient panel");
                                    assert.equal(fillImage.style.display,'none',"Should hide image panel");
                                    assert.equal(fillColor.style.display,'none',"Should hide color panel");
                                    cy.wait(110).then(() => {
                                      let styles = stringToStyles(cssTextArea.value);
                                      assert.equal(styles.fill, "none", "Should switch fill property on CSS tab to 'none'");
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
            });
          });
        });
      });
    });
  });
  it('Stroke tab', () => {
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
            let svg = Cypress.$("svg[id='shape_0']").toArray()[0];
            let polygon = svg.querySelector("polygon");
            assert.isDefined(svg,"Shape svg element should exist for first shape");
            assert.isDefined(polygon,"Shape polygon element should exist for first shape");
            const strokeTab = Cypress.$("#stroke").toArray()[0];
            const strokeColor = strokeTab.querySelector("#strokeColor");
            const strokeWidth = strokeTab.querySelector("#strokeWidth");
            const strokeLinecap = strokeTab.querySelector("#strokeLinecap");
            const strokeDasharray = strokeTab.querySelector("#strokeDasharray");
            const cssTextArea = Cypress.$("#cssTextArea").toArray()[0];
            assert.isFalse(strokeTab.classList.contains("active"),"Should be hidden by default");
            cy.get("#stroke_tab").click().then(() => {
              assert.isTrue(strokeTab.classList.contains("active"),"Should show Stroke tab on click");
              assert.equal(strokeColor.value,"black","Stroke color should be 'black' by default");
              assert.equal(strokeWidth.value,2,"Stroke width should be 2 by default");
              assert.equal(strokeLinecap.value,"square","Stroke linecap should be square by default");
              let lineCapOption = strokeLinecap.querySelector("option[selected]");
              assert.equal(lineCapOption.value,"square","Stroke linecap square option selected by default");
              assert.equal(strokeDasharray.value,0,"Stroke dasharray should be empty by default");
              strokeColor.value = "";
              strokeWidth.value = "";
              strokeDasharray.value = "";
              cy.get("#strokeLinecap").select("round").then(() => {
                cy.get("#strokeColor").type("#ff0000").then(() => {
                  cy.get("#strokeWidth").type("5").then(() => {
                    cy.get("#strokeDasharray").type("10 15").then(() => {
                      let style = stringToStyles(cssTextArea.value);
                      assert.equal(strokeColor.style.backgroundColor,"rgb(255, 0, 0)",
                          "Should set correct background color of stroke input")
                      assert.equal(style.stroke,"#ff0000","Should set correct CSS stroke style");
                      assert.equal(style["stroke-width"],5,"Should set correct CSS stroke width");
                      assert.equal(style["stroke-linecap"],"round","Should set correct CSS stroke linecap")
                      assert.equal(style["stroke-dasharray"],"10 15","Should set correct CSS stroke dasharray")
                      svg = Cypress.$("svg[id='shape_0']").toArray()[0];
                      polygon = svg.querySelector("polygon");
                      style = polygon.style;
                      assert.equal(style.stroke,"rgb(255, 0, 0)","Should set correct polygon stroke style");
                      assert.equal(style["stroke-width"],5,"Should set correct CSS polygon width");
                      assert.equal(style["stroke-linecap"],"round","Should set correct CSS polygon linecap")
                      assert.equal(style["stroke-dasharray"],"10, 15","Should set correct CSS polygon dasharray")
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
