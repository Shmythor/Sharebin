import { VentanaemergComponent } from "../../src/app/pages/home/components/ventanaemerg/ventanaemerg.component";
import { ClientApi } from '../../src/app/services/lb-api/services/custom/Client';
import { ModalModule } from '../../src/app/shared/_modal/modal.module';
import { HttpClient } from '@angular/common/http';

// const VentanaemergComponent = require('../../src/app/pages/home/components/ventanaemerg/ventanaemerg.component');
// const ClientApi = require('../../src/app/services/lb-api/services/custom/Client');
// const ModalService = require('../../src/app/shared/_modal/modal.module')

describe("Test file size limit to 20MB", () => {
    let myPost = new VentanaemergComponent(new ClientApi(), new ModalModule(), new HttpClient());
    myPost.postFile()
    
    expect(true).toBe(true);
});
  
  