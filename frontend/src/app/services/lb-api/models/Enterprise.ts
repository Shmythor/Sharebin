/* tslint:disable */

declare var Object: any;
export interface EnterpriseInterface {
  "name": string;
  "createDate": Date;
  "id"?: any;
  clients?: any[];
}

export class Enterprise implements EnterpriseInterface {
  "name": string;
  "createDate": Date;
  "id": any;
  clients: any[];
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
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'enterpriseId'
        },
      }
    }
  }
}
