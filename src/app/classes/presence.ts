import { EventEmitter } from "@angular/core"; 
import { ApointementModel } from "../presences/models/presence-model";

export class PresenceEmit {
    static presenceEmitter = new EventEmitter<ApointementModel[]>();
}