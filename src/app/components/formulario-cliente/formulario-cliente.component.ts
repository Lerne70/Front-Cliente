import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChange, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Cliente, newCliente } from 'src/app/others/interfaces';
import { InteraccionesService } from 'src/app/services/interacciones.service';
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

  consultarCliente(idCliente: number){
    this.dataservices.consultarCliente(idCliente).subscribe( (res) =>{
      this.cliente = res
      console.log("nuevo Cliente" + this.cliente)
      this.posicion(this.cliente.estado, this.cliente.municipio, this.cliente.colonia, this.cliente.codigoPostal, this.cliente.calle, this.cliente.numExt)
    }, (err) => {
      console.log(err)
    });
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

  agregarCliente(){
    console.log(this.cliente);
    this.dataservices.agregarCliente(this.cliente).subscribe( (res) => {
      //console.log("respuesta Agregar " + res)
      this.consultarCliente(res)
    }, (err) => {
      console.log(err)
    });
  }

  dibujarMapa(lat: number, lng: number): void {
    let mapa = document.getElementById('mapa');
    mapa!.innerHTML="";
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
        mapa,
        defaultLayers.vector.normal.map,
        {
            zoom: 5,
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

  // dibujarMapaMarker(lat: number, lng: number): void {
  //   let mapa = document.getElementById('mapa');
  //   mapa!.innerHTML="";
  //   let defaultLayers = this.platform.createDefaultLayers();
  //   let map = new H.Map(
  //       mapa,
  //       defaultLayers.vector.normal.map,
  //       {
  //           zoom: 15,
  //           center: { lat: 19.3910038, lng: -99.283697 },
  //           pixelRatio: window.devicePixelRatio || 1
  //       }
  //   );
  //   let marker = new H.map.Marker({ lat: lat, lng: lng});
  //   map.addObject(marker);
    
  //  window.addEventListener('resize', () => map.getViewPort().resize());
  //   // let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapa));

  //   // let ui = H.ui.UI.createDefault(mapa, defaultLayers);
  // }
} 
