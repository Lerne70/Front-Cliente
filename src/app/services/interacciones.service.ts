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

  /**
   * Manda un numero que es el id del cliente
   * @param id 
   * @returns json
   */
  consultarCliente(id: number):Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${environment.URL}/cliente/${id}`);
  }

  /**
   * Recive un json tipo cliente con los datos
   * @param cliente 
   * @returns json
   */
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

  /**
   * Recive un numero que es el id el cliente
   * elimina el cliente con el id mandado
   * @param id 
   * @returns 1 si se elimino correctamente o -1 si existe algún error
   */
  eliminarCliente(id: number):Observable<any> {
    return this.httpClient.delete<any>(`${environment.URL}/cliente/${id}`);
  }

  /**
   * Serivicio que trea la datos de localizacion basados en la direccion dada
   * @param direccion 
   * @returns json con dato de localizacion
   */
  ubicarCliente(direccion: string):Observable<Resultado> {
    return this.httpClient.get<Resultado>(`${environment.URLHERE}${direccion}&apiKey=7g_X7QuSEfojfY_AHLDFCzkPXcVYCpztAYQiXeE65pM`);
  }

}
