import { CanActivateFn } from '@angular/router';
import { Auth } from '../classes/auth';
import { PersonnelModel } from '../personnels/models/personnel-model';

 
export const authGuard: CanActivateFn = (route, state) => { 
  let currentUser: PersonnelModel | any;
  let access = false;
  Auth.userEmitter.subscribe(
    user => {
      currentUser = user;  
    }
  );
  return true;
};


export const createGuard: CanActivateFn = (route, state) => { 
  let currentUser: PersonnelModel | any;
  let access = false;
  Auth.userEmitter.subscribe(
    user => {
      currentUser = user;  
      if (currentUser.permission === 'C') {
        access = true;
      } else if (currentUser.permission === 'CR'){
        access = true;
      } else if (currentUser.permission === 'CRU'){
        access = true;
      } else if (currentUser.permission === 'CRUD'){
        access = true;
      }
    }
  );
  return access;
};

export const readGuard: CanActivateFn = (route, state) => { 
  let currentUser: PersonnelModel | any;
  let access = false;
  Auth.userEmitter.subscribe(
    user => {
      currentUser = user;  
      if (currentUser.permission === 'R') {
        access = true;
      } else if (currentUser.permission === 'CR'){
        access = true;
      } else if (currentUser.permission === 'RU'){
        access = true;
      } else if (currentUser.permission === 'RD'){
        access = true;
      } else if (currentUser.permission === 'CRU'){
        access = true;
      } else if (currentUser.permission === 'RUD'){
        access = true;
      } else if (currentUser.permission === 'CRUD'){
        access = true;
      }
    }
  );
  return access;
};


export const updateGuard: CanActivateFn = (route, state) => { 
  let currentUser: PersonnelModel | any;
  let access = false;
  Auth.userEmitter.subscribe(
    user => {
      currentUser = user;  
      if (currentUser.permission === 'U') {
        access = true;
      } else if (currentUser.permission === 'RU'){
        access = true;
      } else if (currentUser.permission === 'CRU'){
        access = true;
      } else if (currentUser.permission === 'RUD'){
        access = true;
      } else if (currentUser.permission === 'CRUD'){
        access = true;
      }
    }
  );
  return access;
};

export const deleteGuard: CanActivateFn = (route, state) => { 
  let currentUser: PersonnelModel | any;
  let access = false;
  Auth.userEmitter.subscribe(
    user => {
      currentUser = user;  
      if (currentUser.permission === 'D') {
        access = true;
      } else if (currentUser.permission === 'RD'){
        access = true;
      } else if (currentUser.permission === 'RUD'){
        access = true;
      } else if (currentUser.permission === 'CRUD'){
        access = true;
      }
    }
  );
  return access;
};