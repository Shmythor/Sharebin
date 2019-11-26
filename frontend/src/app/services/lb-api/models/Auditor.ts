/* tslint:disable */

declare var Object: any;
export interface AuditorInterface {
  "modified_elem": string;
  "date": Date;
  "old_value"?: string;
  "new_value"?: string;
  "id"?: any;
  "documentId"?: any;
}

export class Auditor implements AuditorInterface {
  "modified_elem": string;
  "date": Date;
  "old_value": string;
  "new_value": string;
  "id": any;
  "documentId": any;
  constructor(data?: AuditorInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Auditor`.
   */
  public static getModelName() {
    return "Auditor";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Auditor for dynamic purposes.
  **/
  public static factory(data: AuditorInterface): Auditor{
    return new Auditor(data);
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
      name: 'Auditor',
      plural: 'Auditors',
      path: 'Auditors',
      idName: 'id',
      properties: {
        "modified_elem": {
          name: 'modified_elem',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date',
          default: new Date(0)
        },
        "old_value": {
          name: 'old_value',
          type: 'string'
        },
        "new_value": {
          name: 'new_value',
          type: 'string'
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
      }
    }
  }
}
