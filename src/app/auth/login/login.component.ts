import { Component } from '@angular/core';
import { Validators } from 'ngx-editor';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;

  isLoading = false; 

  form : FormGroup | any

  constructor(
    public themeService: CustomizerSettingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
      this.form = this.formBuilder.group({
        matricule: ['', Validators.required],
        password: ['', Validators.required]
      });
  }


  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;  
      var mat = this.form.value.matricule;
      var code = mat.split("-");
      var code_entreprise = code[code.length - 1];
      var body = {
        matricule: this.form.value.matricule.toLowerCase(),
        password: this.form.value.password,
        code_entreprise: code_entreprise
      };
      this.authService.login(body).subscribe({
          next: (res) => { 
            let user: PersonnelModel = res; 
            let roleList = JSON.stringify(user.roles);
            localStorage.removeItem('roles');
            localStorage.setItem('roles', roleList); 
            if (user.statut_personnel) {
              if (user.roles[0] === 'Dashboard') { 
                this.router.navigate(['/layouts/dashboard']);  
              } else if (user.roles[0] === 'Mes Bulletins') { 
                this.router.navigate(['/layouts/salaires/mes-bulletins-salaires']);  
              } else if (user.roles[0] === 'Personnels') { 
                this.router.navigate(['/layouts/personnels/personnel-list']); 
              } else if (user.roles[0] === 'Pointages') {
                this.router.navigate(['/layouts/presences/pointage']);
              } else if (user.roles[0] === 'Registre de presences') {
                this.router.navigate(['/layouts/presences/registre-presences']);
              } else if (user.roles[0] === 'Heure suplementaires') {
                this.router.navigate(['/layouts/presences/heures-supp']);
              } else if (user.roles[0] === 'Liste de paiements') {
                this.router.navigate(['/layouts/salaires/liste-paiements']);
              } else if (user.roles[0] === 'Statuts de paies') {
                this.router.navigate(['/layouts/salaires/statuts-paies']);
              } else if (user.roles[0] === 'Relevés de paies') {
                this.router.navigate(['/layouts/salaires/releve-paie']);
              } else if (user.roles[0] === 'Avances salaires') {
                this.router.navigate(['/layouts/salaires/avance-salaire']);
              } else if (user.roles[0] === 'Primes divers') {
                this.router.navigate(['/layouts/salaires/primes']);
              } else if (user.roles[0] === 'Pénalites') {
                this.router.navigate(['/layouts/salaires/penalites']);
              } else if (user.roles[0] === 'Pret entreprise') {
                this.router.navigate(['/layouts/salaires/pres-entreprise']);
              } else if (user.roles[0] === 'Syndicats') {
                this.router.navigate(['/layouts/personnels/syndicats']);
              } else if (user.roles[0] === 'Horaires') {
                this.router.navigate(['/layouts/horaire']);
              } else if (user.roles[0] === 'Performences') {
                this.router.navigate(['/layouts/performences']);
              } else if (user.roles[0] === 'Postes') {
                this.router.navigate(['/layouts/recrutements/postes']);
              } else if (user.roles[0] === 'Candidatures') {
                this.router.navigate(['/layouts/recrutements/candidatures']);
              } else if (user.roles[0] === 'Emails') {
                this.router.navigate(['/layouts/mail/inbox']);
              } else if (user.roles[0] === 'Preferences') {
                this.router.navigate(['/layouts/preferences/fonction']);
              } else if (user.roles[0] === 'Reglages') {
                this.router.navigate(['/layouts/preferences/reglages']);
              } else if (user.roles[0] === 'Departements') {
                this.router.navigate(['/layouts/preferences/departement']);
              } else if (user.roles[0] === 'Sites location') {
                this.router.navigate(['/layouts/preferences/site-location']);
              } else if (user.roles[0] === 'Fonctions') {
                this.router.navigate(['/layouts/preferences/fonction']);
              } else if (user.roles[0] === 'Services') {
                this.router.navigate(['/layouts/preferences/services']);
              } else if (user.roles[0] === 'Titres') {
                this.router.navigate(['/layouts/preferences/titles']);
              } else if (user.roles[0] === 'Archives') {
                this.router.navigate(['/layouts/archives']);
              } else {
                this.router.navigate(['/layouts/salaires/mes-bulletins-salaires']); 
              }
            } else {
              this.router.navigate(['/auth/login']);
            }
            
            this.toastr.success(`Bienvenue ${user.prenom}!`, 'Success!');
            this.isLoading = false;
          },
          error: (e) => {
            this.isLoading = false;
            console.error(e);
            // this.toastr.error('Votre matricule ou le mot de passe ou encore les deux ne sont pas correct !', 'Oupss!');
            this.toastr.error(`${e.error.message}`, 'Oupss!');
            this.router.navigate(['/auth/login']); 
          }, 
        }
      ); 
    }  
  } 

 

 

  toggleTheme() { 
      this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
 
}
