import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { faEdit, faFileExcel, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Cliente } from 'src/app/others/interfaces';
import { InteraccionesService } from 'src/app/services/interacciones.service';
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component';
import { modCliente, elimCliente } from '../../others/interfaces';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import * as XLSX from 'xlsx'
import Swal from 'sweetalert2';

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

  private hoja: XLSX.WorkSheet;
  private libro: XLSX.WorkBook;

  constructor (
    private dataservices: InteraccionesService
  )  {
    this.platform = new H.service.Platform({
      "apikey": "BxI0Xmzl8BHfCzGLDwkee-ascvmM80oAPc6uKKff_TQ"
    });
  }

  ngOnInit(){ 
    this.mostrarCliente();
  }

  /**
   * Metodo para cerrar los modales
   */
  closeModal() {
    let modal = document.getElementById('exampleModal');
    modal!.hidden;
    this.mostrarCliente();
    console.log("cerrar");
  }

  /**
   * Metodo para cargar la tabla haciendo uso
   * del servicio mostrarClientes()
   */
  mostrarCliente() {
    this.dataservices.mostrarClientes().subscribe( (res) => {
      this.listClientes = res
    }, (err) => {
      console.log(err)
    });
  }

  /**
   * Metdo que retorna un solo cliente con el que
   * coincida el id enviada
   * @param idCliente 
   */
  consultarCliente(idCliente: number){
    this.dataservices.consultarCliente(idCliente).subscribe( (res) =>{
      this.cliente = res
      this.posicion(this.cliente.estado, this.cliente.municipio, this.cliente.colonia, this.cliente.codigoPostal, this.cliente.calle, this.cliente.numExt)
    }, (err) => {
      console.log(err)
    });
  }

  /**
   * Metodo para modificar los datos del usuario
   * haciendo uso del modificarCliente()
   */
  modificarCliente(){
    if(this.cliente.nombreComercial != '' || 
       this.cliente.calle != '' || 
       this.cliente.codigoPostal != 0 || 
       this.cliente.colonia != '' ||
       this.cliente.correoElectronico != '' ||
       this.cliente.estado != '' ||
       this.cliente.municipio != '' ||
       this.cliente.numExt != '' ||
       this.cliente.razonSocial != '' ||
       this.cliente.telefono != '')
       {
        this.dataservices.modificarCliente(this.cliente).subscribe( (res) => {
          console.log("respuesta Modificar " + res)
          Swal.fire(
            'Operacion exitosa',
            'El cliente fue agregado con exito',
            'success'
          )
          this.consultarCliente(this.cliente.id)
          this.mostrarCliente()
        }, (err) => {
          console.log(err)
          Swal.fire(
            'Algo salio mal',
            'Inrgrese nuevamente sus datos',
            'error'
          )
        });
       } else {
        Swal.fire(
          'Algo salio mal',
          'Ingrese todos los datos',
          'error'
        )
       }
    
  }

  /**
   * Metodo para eliminar un registro de la base de datos
   */
  eliminarCliente(){
    this.dataservices.eliminarCliente(this.cliente.id).subscribe( (res) => {
      console.log("respuesta Elimianr " + res)
      this.mostrarCliente()
    }, (err) => {
      console.log(err)
    })
  }

  /**
   * Metodo para obtener la latitud y longitud
   * de un cliente recien ingresado
   * @param estado 
   * @param municipio 
   * @param colonia 
   * @param codigoPostal 
   * @param calle 
   * @param numExt 
   */
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

  /**
   * Metodo para renderizar el mapa y colocar un marcador
   * @param lat 
   * @param lng 
   */
  dibujarMapa(lat: number, lng: number): void {
    let mapa = document.getElementById('mapa2');
    mapa!.innerHTML="";
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
        mapa,
        defaultLayers.vector.normal.map,
        {
            zoom: 15,
            center: { lat: lat, lng:lng },
            pixelRatio: window.devicePixelRatio || 1
        }
    );
    let marker = new H.map.Marker({ lat: lat, lng: lng });
    map.addObject(marker);
    
    window.addEventListener('resize', () => map.getViewPort().resize());
    // let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapa));
    // let ui = H.ui.UI.createDefault(mapa, defaultLayers);
  }
  
  /**
   * Metodo que genera un archivo PDF basados en la tanbla mostrada
   */
  generarPDF(){
    const doc = new jsPDF()
    autoTable(doc, { html: '#tableClientes' })
    doc.save('tableClientes.pdf')
  }

  /**
   * Metodo para generar el excel con todo los datos que 
   * se muestran en la tabla
   */
  generarExcel(){
    this.hoja = XLSX.utils.json_to_sheet(this.listClientes);
    this.libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(this.libro, this.hoja, 'Datos Cliente');
    XLSX.writeFile(this.libro, 'Listado-Clientes.xlsx');
  }

}
