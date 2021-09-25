import { Component, OnInit } from '@angular/core';
import { faEdit, faFileExcel, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  titulo = "Clientes";

  tituloModal = "Registrar Cliente"

  // Icons
  faPlus = faPlus
  faFilePDF = faFilePdf
  faFileExcel = faFileExcel
  faEdit = faEdit
  faDelete = faTrash

  constructor() { }

  ngOnInit(): void {
  }


  public saveFile(fileName: string): void {
    // ... save file
  }

  public handleDenial(): void {
      // ... don't save file and quit
  }

  public handleDismiss(dismissMethod: string): void {
    // dismissMethod can be 'cancel', 'overlay', 'close', and 'timer'
    // ... do something
  }

}
