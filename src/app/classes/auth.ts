import { EventEmitter } from "@angular/core";
import { PersonnelModel } from "../personnels/models/personnel-model";

export class Auth {
    static userEmitter = new EventEmitter<PersonnelModel>();
}