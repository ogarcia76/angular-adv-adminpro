import { Hospital } from "./hospital.model";

export class Medico {

    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuarii?: _MedicolUser,
        public hospital?: Hospital
    ) {}
}

interface _MedicolUser {
    _id: string;
    nombre: string;
    img: string;
}