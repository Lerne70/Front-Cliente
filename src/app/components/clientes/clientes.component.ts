import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { faEdit, faFileExcel, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Cliente } from 'src/app/others/interfaces';
import { InteraccionesService } from 'src/app/services/interacciones.service';
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component';
import { modCliente, elimCliente } from '../../others/interfaces';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  titulo = "Clientes";

  tituloModal = "Registrar Cliente";

  // Icons
  faPlus = faPlus;
  faFilePDF = faFilePdf;
  faFileExcel = faFileExcel;
  faEdit = faEdit;
  faDelete = faTrash;

  listClientes: Cliente[] = [];

  cliente: modCliente = {
    id: 0,
    nombreComercial: '',
    razonSocial: '',
    correoElectronico: '',
    telefono: '',
    estado: '',
    municipio: '',
    colonia: '',
    codigoPostal: 0,
    calle: '',
    numExt: '',
    numInt: ''
  };

  constructor (
    private dataservices: InteraccionesService
  )  {}

  ngOnInit(){ 
    this.mostrarCliente();
  }

  closeModal() {
    let modal = document.getElementById('exampleModal');
    modal!.hidden;
    this.mostrarCliente();
    console.log("cerrar");
  }

  mostrarCliente() {
    this.dataservices.mostrarClientes().subscribe( (res) => {
      this.listClientes = res
    }, (err) => {
      console.log(err)
    });
  }

  consultarCliente(idCliente: number){
    this.dataservices.consultarCliente(idCliente).subscribe( (res) =>{
      this.cliente = res
    }, (err) => {
      console.log(err)
    });
  }

  modificarCliente(){
    this.dataservices.modificarCliente(this.cliente).subscribe( (res) => {
      console.log("respuesta Modificar " + res)
      this.mostrarCliente()
    }, (err) => {
      console.log(err)
    });
    this.mostrarCliente();
  }

  eliminarCliente(){
    this.dataservices.eliminarCliente(this.cliente.id).subscribe( (res) => {
      console.log("respuesta Elimianr " + res)
      this.mostrarCliente()
    }, (err) => {
      console.log(err)
    })
  }


}
