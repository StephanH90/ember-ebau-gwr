import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | building/edit/entrance", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:building/edit/entrance");
    assert.ok(route);
  });
});
