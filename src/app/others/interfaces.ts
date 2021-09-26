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

export interface ubicarCliente{
    estado: string,
    municipio: string,
    colonia: string,
    codigoPostal: number,
    calle: string,
    numExt: string
}



export interface Resultado {
    items: Item[];
}

export interface Item {
    title:               string;
    id:                  string;
    resultType:          string;
    houseNumberType:     string;
    address:             Address;
    position:            Position;
    access:              Position[];
    mapView:             MapView;
    houseNumberFallback: boolean;
    scoring:             Scoring;
}

export interface Position {
    lat: number;
    lng: number;
}

export interface Address {
    label:       string;
    countryCode: string;
    countryName: string;
    stateCode:   string;
    state:       string;
    city:        string;
    district:    string;
    street:      string;
    postalCode:  string;
    houseNumber: string;
}

export interface MapView {
    west:  number;
    south: number;
    east:  number;
    north: number;
}

export interface Scoring {
    queryScore: number;
    fieldScore: FieldScore;
}

export interface FieldScore {
    state:       number;
    city:        number;
    district:    number;
    streets:     number[];
    houseNumber: number;
    postalCode:  number;
}
