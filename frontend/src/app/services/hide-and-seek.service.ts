import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HideAndSeekService {

  constructor() { }

  public showDownloadButton(buttonId: any) {
    document.getElementById('downloadButton-' + buttonId).style.display = 'block';
  }

  public hideDownloadButton(buttonId: any) {
    document.getElementById('downloadButton-' + buttonId).style.display = 'none';
  }
  public showDownloadFav(buttonId: any) {
    document.getElementById('favouriteButton-' + buttonId).style.display = 'block';
  }

  public hideDownloadFav(buttonId: any) {
    document.getElementById('favouriteButton-' + buttonId).style.display = 'none';
  }

  public showPapperBinButton(buttonId: any) {
    document.getElementById('papperBinButton-' + buttonId).style.display = 'block';
  }

  public hidePapperBinButton(buttonId: any) {
    document.getElementById('papperBinButton-' + buttonId).style.display = 'none';
  }

  public showShareIcon(buttonId: any) {
    document.getElementById('shareIcon-' + buttonId).style.display = 'block';
  }

  public hideShareIcon(buttonId: any) {
    document.getElementById('shareIcon-' + buttonId).style.display = 'none';
  }

  public showFileMove2BinMessage() {
    document.getElementById('fileMove2Bin').style.display = 'block';
    setTimeout(() => {
      document.getElementById('fileMove2Bin').style.display = 'none';
    }, 3000);
  }

  public closeMessagefileMove2Bin() {
    document.getElementById('fileMove2Bin').style.display = 'none';
  }

  public showRecoverButton(buttonId: any){
    document.getElementById('recoverButton-' + buttonId).style.display = 'block';
  }

  public hideRecoverButton(buttonId: any){
    document.getElementById('recoverButton-' + buttonId).style.display = 'none';
  }

  public showFileMove2HomeMessage() {
    document.getElementById('fileMove2Home').style.display = 'block';
  }

  public closeMessagefileMove2Home(){
    document.getElementById('fileMove2Home').style.display = 'none';
  }

  public showFileDeletedFileMessage() {
    document.getElementById('fileDeletedFile').style.display = 'block';
  }

  public closeMessagefileDeletedFile(){
    document.getElementById('fileDeletedFile').style.display = 'none';
  }
}
