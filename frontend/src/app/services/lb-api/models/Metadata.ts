/* tslint:disable */

declare var Object: any;
export interface MetadataInterface {
  "key": string;
  "value": string;
  "createDate": Date;
  "updateDate": Date;
  "id"?: any;
  "documentId"?: any;
  document?: any;
}

export class Metadata implements MetadataInterface {
  "key": string;
  "value": string;
  "createDate": Date;
  "updateDate": Date;
  "id": any;
  "documentId": any;
  document: any;
  constructor(data?: MetadataInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Metadata`.
   */
  public static getModelName() {
    return "Metadata";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Metadata for dynamic purposes.
  **/
  public static factory(data: MetadataInterface): Metadata{
    return new Metadata(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Metadata',
      plural: 'metadata',
      path: 'metadata',
      idName: 'id',
      properties: {
        "key": {
          name: 'key',
          type: 'string'
        },
        "value": {
          name: 'value',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date',
          default: new Date(0)
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date',
          default: new Date(0)
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "documentId": {
          name: 'documentId',
          type: 'any'
        },
      },
      relations: {
        document: {
          name: 'document',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'documentId',
          keyTo: 'id'
        },
      }
    }
  }
}
