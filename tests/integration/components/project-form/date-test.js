import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | project-form/date", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ProjectForm::Date />`);

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(hbs`
      <ProjectForm::Date>
        template block text
      </ProjectForm::Date>
    `);

    assert.equal(this.element.textContent.trim(), "template block text");
  });
});
