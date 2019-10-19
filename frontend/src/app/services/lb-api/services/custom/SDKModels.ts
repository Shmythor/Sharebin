/* tslint:disable */
import { Injectable } from '@angular/core';
import { Document } from '../../models/Document';
import { Metadata } from '../../models/Metadata';
import { Enterprise } from '../../models/Enterprise';
import { Folder } from '../../models/Folder';
import { Client } from '../../models/Client';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    Document: Document,
    Metadata: Metadata,
    Enterprise: Enterprise,
    Folder: Folder,
    Client: Client,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
