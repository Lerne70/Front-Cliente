import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { faEdit, faFileExcel, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Cliente } from 'src/app/others/interfaces';
import { InteraccionesService } from 'src/app/services/interacciones.service';
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component';
import { modCliente, elimCliente } from '../../others/interfaces';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

declare var H: any;

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  private platform: any;

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
  )  {
    this.platform = new H.service.Platform({
      "apikey": "CSj1Pmz-PyT9GaTC3OHqlxGja6CeKU0HYsWtusaXwqA"
    });
  }

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
      this.posicion(this.cliente.estado, this.cliente.municipio, this.cliente.colonia, this.cliente.codigoPostal, this.cliente.calle, this.cliente.numExt)
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

  posicion(estado: string, municipio: string, colonia: string, codigoPostal: number, calle: string, numExt: string){
    let reEstado = estado.split(' ').join('+');
    let reMunicipio = municipio.split(' ').join('+');
    let reColonia = colonia.split(' ').join('+');
    let reCalle = calle.split(' ').join('+');
    let reNumExt = numExt.split(' ').join('+');
    let domicilio = `${reEstado}+${reMunicipio}+${reColonia}+${codigoPostal}+${reCalle}+${reNumExt}`;
    this.dataservices.ubicarCliente(domicilio).subscribe( (res) => {
      res.items.forEach(item => {
        console.log(item.position.lat, item.position.lng)
        this.dibujarMapa(item.position.lat, item.position.lng)
      });
    }, (err) => {
      console.log(err)
    })
  }

  dibujarMapa(lat: number, lng: number): void {
    let mapa = document.getElementById('mapa2');
    mapa!.innerHTML="";
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
        mapa,
        defaultLayers.vector.normal.map,
        {
            zoom: 15,
            center: { lat: 21.1165397, lng: -101.7194143 },
            pixelRatio: window.devicePixelRatio || 1
        }
    );
    let marker = new H.map.Marker({ lat: lat, lng: lng });
    map.addObject(marker);
    
    window.addEventListener('resize', () => map.getViewPort().resize());
    // let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapa));
    // let ui = H.ui.UI.createDefault(mapa, defaultLayers);
  }

  generarPDF(){
    const doc = new jsPDF()
    autoTable(doc, { html: '#tableClientes' })
    doc.save('tableClientes.pdf')
  }


}
