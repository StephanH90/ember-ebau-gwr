import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class RealestateIdentification extends XMLModel {
  @tracked number;
  @tracked EGRID;
  @tracked numberSuffix;
  @tracked subDistrict;
  @tracked lot;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      namespace: "realestateIdentification",
      fields: {
        number: Number,
        EGRID: Number,
        numberSuffix: Number,
        subDistrict: Number,
        lot: Number,
      },
    });
  }

  // TODO on a new project we can somehow not set the egrid

  static template = `
  <ns2:realestateIdentification>
    <number>{{model.number}}</number>
    {{#if model.numberSuffix}}
      <numberSuffix>{{model.numberSuffix}}</numberSuffix>
    {{/if}}
    {{#if model.subDistrict}}
      <subDistrict>{{model.subDistrict}}</subDistrict>
    {{/if}}
    {{#if model.lot}}
      <lot>{{model.lot}}</lot>
    {{/if}}
  </ns2:realestateIdentification>
  `;
}
