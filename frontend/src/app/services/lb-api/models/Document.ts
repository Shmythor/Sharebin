/* tslint:disable */

declare var Object: any;
export interface DocumentInterface {
  "name": string;
  "description"?: string;
  "path": string;
  "createDate": Date;
  "updateDate": Date;
  "url"?: string;
  "size": number;
  "type": string;
  "isDeleted"?: boolean;
  "id"?: any;
  "clientId"?: any;
  metadatas?: any[];
  client?: any;
}

export class Document implements DocumentInterface {
  "name": string;
  "description": string;
  "path": string;
  "createDate": Date;
  "updateDate": Date;
  "url": string;
  "size": number;
  "type": string;
  "isDeleted": boolean;
  "id": any;
  "clientId": any;
  metadatas: any[];
  client: any;
  constructor(data?: DocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Document`.
   */
  public static getModelName() {
    return "Document";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Document for dynamic purposes.
  **/
  public static factory(data: DocumentInterface): Document{
    return new Document(data);
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
      name: 'Document',
      plural: 'documents',
      path: 'documents',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "path": {
          name: 'path',
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
        "url": {
          name: 'url',
          type: 'string'
        },
        "size": {
          name: 'size',
          type: 'number'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "isDeleted": {
          name: 'isDeleted',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "clientId": {
          name: 'clientId',
          type: 'any'
        },
      },
      relations: {
        metadatas: {
          name: 'metadatas',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'documentId'
        },
        client: {
          name: 'client',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'clientId',
          keyTo: 'id'
        },
      }
    }
  }
}
