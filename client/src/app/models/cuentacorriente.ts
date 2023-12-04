export class Cuentacorriente{
	constructor(
		public _id: string,
        public nombre: string,
        public apellido: string,
        public dni:string,
        public domicilio: string,
        public telefono: string,
		public email: string,
		public monto: string,
        public imagen: string,
        public user: string,
	){}
}