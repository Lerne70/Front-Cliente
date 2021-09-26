import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Cliente, modCliente, newCliente, Resultado } from '../others/interfaces';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class InteraccionesService {
  constructor(
    private httpClient: HttpClient
  ) { }

  mostrarClientes():Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${environment.URL}/clientes`);
  }

  /**
   * Manda un json con los datos del cliente
   * @param cliente objeco cliente
   * @returns un numero 
   */
  agregarCliente(cliente:newCliente):Observable<any> {
    const body = new URLSearchParams();
    body.set('nombreComercial', cliente.nombreComercial);
    body.set('razonSocial', cliente.razonSocial);
    body.set('correoElectronico', cliente.correoElectronico);
    body.set('telefono', cliente.telefono);
    body.set('estado', cliente.estado);
    body.set('municipio', cliente.municipio);
    body.set('colonia', cliente.colonia);
    body.set('codigoPostal', cliente.codigoPostal.toString());
    body.set('calle', cliente.calle);
    body.set('numExt', cliente.numExt);
    body.set('numInt', cliente.numInt);
    const cabeceras = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.post<any>(`${environment.URL}/agregar`, body, {headers: cabeceras});
  }

  consultarCliente(id: number):Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${environment.URL}/cliente/${id}`);
  }

  modificarCliente(cliente: modCliente):Observable<any> {
    const body = new URLSearchParams();
    body.set('id', cliente.id.toString());
    body.set('nombreComercial', cliente.nombreComercial);
    body.set('razonSocial', cliente.razonSocial);
    body.set('correoElectronico', cliente.correoElectronico);
    body.set('telefono', cliente.telefono);
    body.set('estado', cliente.estado);
    body.set('municipio', cliente.municipio);
    body.set('colonia', cliente.colonia);
    body.set('codigoPostal', cliente.codigoPostal.toString());
    body.set('calle', cliente.calle);
    body.set('numExt', cliente.numExt);
    body.set('numInt', cliente.numInt);
    const cabeceras = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.put<any>(`${environment.URL}/cliente/${body.get('id')}`, body, {headers: cabeceras});
  }

  eliminarCliente(id: number):Observable<any> {
    return this.httpClient.delete<any>(`${environment.URL}/cliente/${id}`);
  }

  ubicarCliente(direccion: string):Observable<Resultado> {
    return this.httpClient.get<Resultado>(`${environment.URLHERE}${direccion}&apiKey=G-18BRIgI-YT1FJRbyAxc__Y53KqHKF4qhojRhY04aI`);
  }

}
