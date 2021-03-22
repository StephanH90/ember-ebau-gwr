import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";
import {
  languageOptions,
  periodOfConstructionOptions,
} from "ember-ebau-gwr/models/options";

export default class SearchBuildingController extends Controller {
  @service constructionProject;
  @service config;
  @service intl;

  @tracked activeBuilding;

  periodOfConstruction = periodOfConstructionOptions;

  @lastValue("search") searchResults;
  @task *search(query) {
    query.streetLang = languageOptions[this.intl.primaryLocale];
    query.municipality = this.config.municipalityId;
    return yield this.constructionProject.searchBuilding(query);
  }

  @action
  async linkBuilding(EGID, buildingWork) {
    this.activeBuilding = null;
    await this.constructionProject.bindBuildingToConstructionProject(
      this.model,
      EGID,
      buildingWork
    );
    this.transitionToRoute("project.linked-buildings", this.model);
  }

  @action
  setActiveBuilding(EGID) {
    this.activeBuilding = EGID;
  }
}
