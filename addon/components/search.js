import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { dropTask } from "ember-concurrency";
import ExtendedSearchValidations from "ember-ebau-gwr/validations/extended-search-fields";

export default class SearchComponent extends Component {
  @tracked page = 1;
  @tracked searchResults = null;
  @tracked hasMoreResults = false;

  @service notification;
  @service intl;
  @service config;

  constructor(owner, args) {
    super(owner, args);

    let validations = {
      ...this.args.validations,
    };
    let baseQuery = {
      ...(this.args.baseQuery ?? {}),
    };

    if (this.args.extendedSearch) {
      validations = {
        ...validations,
        ...ExtendedSearchValidations,
      };
      baseQuery = {
        ...baseQuery,
        createDate: {
          dateFrom: null,
          dateTo: null,
        },
        modifyDate: {
          dateFrom: null,
          dateTo: null,
        },
      };
    }

    this.changeset = new Changeset(
      baseQuery,
      lookupValidator(validations),
      validations
    );
  }

  @dropTask
  *search(_query) {
    try {
      this.rawQuery = {
        ...this.rawQuery,
        ..._query?.pendingData,
        page: this.page,
      };

      const _results = yield this.args.service.search(this.rawQuery);
      if (!_results || _results.length < this.config.pageSize) {
        this.hasMoreResults = false;
      } else {
        this.hasMoreResults = true;
      }

      this.searchResults =
        this.page === 1 ? _results : this.searchResults.concat(_results);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError")
      );
    }
  }

  @dropTask
  *onSubmit(args) {
    this.searchResults = [];
    this.page = 1;
    yield this.search.perform(args);
  }

  @dropTask
  *loadMore() {
    this.page += 1;
    yield this.search.perform();
  }
}
