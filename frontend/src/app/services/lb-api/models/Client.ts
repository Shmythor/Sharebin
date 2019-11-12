/* tslint:disable */

declare var Object: any;
export interface ClientInterface {
  "name": string;
  "createDate": Date;
  "theme"?: string;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: any;
  "enterpriseId"?: any;
  "password"?: string;
  accessTokens?: any[];
  enterprise?: any;
  documents?: any[];
  folder?: any;
}

export class Client implements ClientInterface {
  "name": string;
  "createDate": Date;
  "theme": string;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": any;
  "enterpriseId": any;
  "password": string;
  accessTokens: any[];
  enterprise: any;
  documents: any[];
  folder: any;
  constructor(data?: ClientInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Client`.
   */
  public static getModelName() {
    return "Client";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Client for dynamic purposes.
  **/
  public static factory(data: ClientInterface): Client{
    return new Client(data);
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
      name: 'Client',
      plural: 'Clients',
      path: 'Clients',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "theme": {
          name: 'theme',
          type: 'string'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "enterpriseId": {
          name: 'enterpriseId',
          type: 'any'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        enterprise: {
          name: 'enterprise',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'enterpriseId',
          keyTo: 'id'
        },
        documents: {
          name: 'documents',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'clientId'
        },
        folder: {
          name: 'folder',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'clientId'
        },
      }
    }
  }
}
