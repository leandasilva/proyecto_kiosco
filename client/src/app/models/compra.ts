export class Compra{
	constructor(
		public _id: string,
        public razonsocial: string,
		public factura: string,
		public monto: string,
		public created_at: string,
		public user: string
	){}
}