export interface Cliente {
    id: number,
    nombreComercial: string,
    razonSocial: string,
    correoElectronico: string,
    telefono: string, 
    estado: string,
    municipio: string,
    colonia: string,
    codigoPostal: number,
    calle: string,
    numExt: string,
    numInt: string,
    estatus: number
}

export interface newCliente {
    nombreComercial: string,
    razonSocial: string,
    correoElectronico: string,
    telefono: string, 
    estado: string,
    municipio: string,
    colonia: string,
    codigoPostal: number,
    calle: string,
    numExt: string,
    numInt: string
}

export interface modCliente{
    id: number,
    nombreComercial: string,
    razonSocial: string,
    correoElectronico: string,
    telefono: string, 
    estado: string,
    municipio: string,
    colonia: string,
    codigoPostal: number,
    calle: string,
    numExt: string,
    numInt: string
}

export interface elimCliente{
    id: number
}