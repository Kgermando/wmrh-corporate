import { CanActivateFn } from '@angular/router'; 
 
export const dashboardGuard: CanActivateFn = (route, state) =>  {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Dashboard')) { 
    access = true;
  }  
  return access; 
};

export const personnelsGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Personnels')) { 
    access = true;
  }    
  return access; 
};
export const pointagesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Pointages')) { 
    access = true;
  }     
  return access; 
};

export const registrePresenceGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Registre de presences')) { 
    access = true;
  }     
  return access;  
};

export const heureSuppGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Heure suplementaires')) { 
    access = true;
  }     
  return access;  
};

export const listePaiementGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Liste de paiements')) { 
    access = true;
  }     
  return access;  
};

export const statutPaieGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Statuts de paies')) { 
    access = true;
  }     
  return access;  
};

export const mesBulletinsGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Mes Bulletins')) { 
    access = true;
  }     
  return access;  
};

export const relevePaieGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Relevés de paies')) { 
    access = true;
  }     
  return access;  
};

export const avanceSalaireGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Avances salaires')) { 
    access = true;
  }     
  return access;  
};

export const primeDiversGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Primes divers')) { 
    access = true;
  }     
  return access;
};

export const penaliteGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Pénalites')) { 
    access = true;
  }     
  return access;  
};

export const presEntrepriseGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Pret entreprise')) { 
    access = true;
  }     
  return access;  
};

export const indemniteGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Indemnités')) { 
    access = true;
  }
  return access;  
};

export const syndicatGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Syndicats')) { 
    access = true;
  }     
  return access;  
};

export const horaireGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Horaires')) { 
    access = true;
  }     
  return access;  
};

export const performenceGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Performences')) { 
    access = true;
  }     
  return access;  
};

export const postesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Postes')) { 
    access = true;
  }     
  return access;  
};

export const candidaturesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Candidatures')) { 
    access = true;
  }     
  return access;  
};

export const emailsGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Emails')) { 
    access = true;
  }     
  return access;  
};

export const preferencesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Preferences')) { 
    access = true;
  }     
  return access;  
};

export const reglagesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Reglages')) { 
    access = true;
  }     
  return access;  
};

export const departementsGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Departements')) { 
    access = true;
  }     
  return access;
};

export const siteLocationGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Sites location')) { 
    access = true;
  }     
  return access;
};

export const fonctionGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Fonctions')) { 
    access = true;
  }     
  return access;
};

export const serviceGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Services')) { 
    access = true;
  }     
  return access;
};

export const titresGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Titres')) { 
    access = true;
  }     
  return access;
};

export const archivesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Archives')) { 
    access = true;
  }     
  return access;  
};

export const supportGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Support')) { 
    access = true;
  }     
  return access;  
};
