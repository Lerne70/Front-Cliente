import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChange, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Cliente, newCliente } from 'src/app/others/interfaces';
import { InteraccionesService } from 'src/app/services/interacciones.service';
import Swal from 'sweetalert2';
import { ubicarCliente, Resultado } from '../../others/interfaces';

declare var H: any;

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent implements OnInit {
  private platform: any;

  public mapElement: ElementRef;

  listClientes: Cliente[] = [];

  cliente: newCliente = {
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

  faSave = faSave;

  constructor(
    private dataservices: InteraccionesService
  ) { 
    this.platform = new H.service.Platform({
      "apikey": "CSj1Pmz-PyT9GaTC3OHqlxGja6CeKU0HYsWtusaXwqA"
    });
  }

  ngOnInit(): void {
    
  }
  
  /**
   * Metdo que retorna un solo cliente con el que
   * coincida el id enviada
   * @param idCliente 
   */
  consultarCliente(idCliente: number){
    this.dataservices.consultarCliente(idCliente).subscribe( (res) =>{
      this.cliente = res
      console.log("nuevo Cliente" + this.cliente)
      this.posicion(this.cliente.estado, this.cliente.municipio, this.cliente.colonia, this.cliente.codigoPostal, this.cliente.calle, this.cliente.numExt)
    }, (err) => {
      console.log(err)
    });
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
   * Metodo que hace uso del servicio para ingresar
   * un cliente a la base de datos
   */
  agregarCliente(){
    console.log(this.cliente);
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
        this.dataservices.agregarCliente(this.cliente).subscribe( (res) => {
          //console.log("respuesta Agregar " + res)
          Swal.fire(
            'Operacion exitosa',
            'El cliente fue agregado con exito',
            'success'
          )
          this.consultarCliente(res)
        }, (err) => {
          Swal.fire(
            'Algo salio mal',
            'Inrgrese nuevamente sus datos',
            'error'
          )
          console.log(err)
        });
    }else {
      Swal.fire(
        'Algo salio mal',
        'Ingrese todos los datos',
        'error'
      )
    }
    
  }
  
  /**
   * Metodo para renderizar el mapa y colocar un marcador
   * @param lat 
   * @param lng 
   */
  dibujarMapa(lat: number, lng: number): void {
    let mapa = document.getElementById('mapa');
    mapa!.innerHTML="";
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
        mapa,
        defaultLayers.vector.normal.map,
        {
            zoom: 15,
            center: { lat: lat, lng: lng },
            pixelRatio: window.devicePixelRatio || 1
        }
    );
    let marker = new H.map.Marker({ lat: lat, lng: lng });
    map.addObject(marker);
    
    window.addEventListener('resize', () => map.getViewPort().resize());
    // let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapa));

    // let ui = H.ui.UI.createDefault(mapa, defaultLayers);
  }

} 
