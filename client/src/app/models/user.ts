export class User{
	constructor(
		public _id: string,
		public razonsocial: string,
		public name: string,
		public surname: string,
		public domicilio: string,
		public telefono: string,
		public email: string,
		public password: string,
		public role: string,
		public image: string,
		public parcial: string,
		public total: string
	){}
}