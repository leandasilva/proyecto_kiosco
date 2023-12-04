export class Proveedor{
	constructor(
		public _id: string,
        public razonsocial: string,
        public domicilio: string,
        public telefono: string,
		public email: string,
		public monto: string,
		public created_at: string,
		public user: string
	){}
}