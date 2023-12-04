export class Anulacion{
	constructor(
		public _id: string,
        public cantidadprod: Array<any>,
		public total: string,
		public formapago: string,
        public created_at: string,
        public cajero: string,
	){}
}