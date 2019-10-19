/* tslint:disable */

declare var Object: any;
export interface FolderInterface {
  "id"?: number;
  "clientId"?: any;
}

export class Folder implements FolderInterface {
  "id": number;
  "clientId": any;
  constructor(data?: FolderInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Folder`.
   */
  public static getModelName() {
    return "Folder";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Folder for dynamic purposes.
  **/
  public static factory(data: FolderInterface): Folder{
    return new Folder(data);
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
      name: 'Folder',
      plural: 'Folders',
      path: 'Folders',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "clientId": {
          name: 'clientId',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
