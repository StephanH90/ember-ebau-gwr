import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class ProjectNavComponent extends Component {
  @service router;
  @service store;
  @service config;
  @service constructionProject;
  @service intl;

  get displayLandingPage() {
    return (
      !this.projects.length &&
      this.router.externalRouter.currentRoute.localName !== "new" &&
      this.router.externalRouter.currentRoute.localName !== "errors"
    );
  }

  get buildingTabInfoText() {
    if (!this.activeProject) {
      return this.intl.t(
        "ember-gwr.linkedBuildings.buildingDisabledForNewProject"
      );
    } else if (
      this.projects.find((project) => project.EPROID === this.activeProject)
        ?.typeOfConstructionProject !== 6011
    ) {
      return this.intl.t(
        "ember-gwr.linkedBuildings.buildingDisabledForInfrastructure"
      );
    }

    return null;
  }

  get activeProject() {
    return Number(this.router.externalRouter.currentRoute.params.project_id);
  }

  get projects() {
    return this.constructionProject.projects;
  }

  @action
  async onLoad() {
    // We then use `gwr.projects` in the template to reference this.
    // This is so we can update the table if we add a new project in the subroute /new
    const projects = await this.constructionProject.all.perform(
      this.args.caseId
    );

    // Load the first project in the list if none is selected so we always display a project.
    if (
      !["form", "new", "linked-buildings", "errors"].includes(
        this.router.externalRouter.currentRoute.localName
      ) &&
      projects.length
    ) {
      this.router.transitionTo("project.form", projects[0].EPROID);
    }
  }

  @action
  async removeProjectLink() {
    const link = this.store
      .peekAll("gwr-link")
      .find(({ eproid }) => Number(eproid) === this.activeProject);
    await link.destroyRecord();
    await this.constructionProject.all.perform(this.args.caseId);
  }
}
