import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChange, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { Cliente, newCliente } from 'src/app/others/interfaces';
import { InteraccionesService } from 'src/app/services/interacciones.service';

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

  constructor(
    private dataservices: InteraccionesService
  ) { 
    this.platform = new H.service.Platform({
      "apikey": "1d72vsynyhAwmS5TS31h6z8h6_X6YJPXmpOLgKzWEVk"
    });
  }

  ngOnInit(): void {
    this.dibujarMapa();
  }

  agregarCliente(){
    console.log(this.cliente);
    this.dataservices.agregarCliente(this.cliente).subscribe( (res) => {
      console.log("respuesta Agregar " + res)
    }, (err) => {
      console.log(err)
    });
  }

  dibujarMapa(): void {
    let mapa = document.getElementById('mapa');
    mapa!.innerHTML="";
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
        mapa,
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center: { lat: 21.1165397, lng: -101.7194143 },
            pixelRatio: window.devicePixelRatio || 1
        }
    );
    
   window.addEventListener('resize', () => map.getViewPort().resize());
    // let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapa));

    // let ui = H.ui.UI.createDefault(mapa, defaultLayers);
  }
} 
