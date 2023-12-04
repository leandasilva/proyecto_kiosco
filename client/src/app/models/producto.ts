export class Producto{
  [x: string]: any;
  filter(arg0: (item: any) => boolean): Producto {
    throw new Error('Method not implemented.');
  }
	constructor(
		public _id: string,
		public nombre: string,
		public rubro: string,
        public cantidad: Number,
        public precio: string,
		public codigo: string,
		public estado: string,
		public image: string,
		public user: string
	){}
}
