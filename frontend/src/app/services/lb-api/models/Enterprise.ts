/* tslint:disable */
import {
  Client
} from '../index';

declare var Object: any;
export interface EnterpriseInterface {
  "name": string;
  "createDate": Date;
  "id"?: any;
  clients?: Client[];
}

export class Enterprise implements EnterpriseInterface {
  "name": string;
  "createDate": Date;
  "id": any;
  clients: Client[];
  constructor(data?: EnterpriseInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Enterprise`.
   */
  public static getModelName() {
    return "Enterprise";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Enterprise for dynamic purposes.
  **/
  public static factory(data: EnterpriseInterface): Enterprise{
    return new Enterprise(data);
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
      name: 'Enterprise',
      plural: 'Enterprises',
      path: 'Enterprises',
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
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        clients: {
          name: 'clients',
          type: 'Client[]',
          model: 'Client',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'enterpriseId'
        },
      }
    }
  }
}
