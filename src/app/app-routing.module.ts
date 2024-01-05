import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { PersonnelListComponent } from './personnels/personnel-list/personnel-list.component';
import { PersonnelEditComponent } from './personnels/personnel-edit/personnel-edit.component';
import { PersonnelAddComponent } from './personnels/personnel-add/personnel-add.component';
import { PersonnelViewComponent } from './personnels/personnel-view/personnel-view.component';
import { InboxComponent } from './mail/inbox/inbox.component';
import { ComposeComponent } from './mail/compose/compose.component';
import { ReadComponent } from './mail/read/read.component';
import { ReglagesComponent } from './preferences/reglages/reglages.component';
import { FonctionComponent } from './preferences/fonction/fonction.component';
import { DepartementsComponent } from './preferences/departements/departements.component';
import { ServicesComponent } from './preferences/services/services.component';
import { TitlesComponent } from './preferences/titles/titles.component';
import { SiteLocationComponent } from './preferences/site-location/site-location.component';
import { PointageComponent } from './presences/pointage/pointage.component';
import { RegistrePresenceComponent } from './presences/registre-presence/registre-presence.component';
import { SyndicatsComponent } from './syndicats/syndicats.component';
import { PostesComponent } from './recrutements/postes/postes.component';
import { CandidaturesComponent } from './recrutements/candidatures/candidatures.component';
import { PosteAddComponent } from './recrutements/postes/poste-add/poste-add.component';
import { PosteEditComponent } from './recrutements/postes/poste-edit/poste-edit.component';
import { PosteViewComponent } from './recrutements/postes/poste-view/poste-view.component';
import { CandidatureAddComponent } from './recrutements/candidatures/candidature-add/candidature-add.component';
import { CandidatureEditComponent } from './recrutements/candidatures/candidature-edit/candidature-edit.component';
import { CandidatureViewComponent } from './recrutements/candidatures/candidature-view/candidature-view.component';
import { SyndicatViewComponent } from './syndicats/syndicat-view/syndicat-view.component';
import { PrimesComponent } from './primes/primes.component';
import { HeuresSuppComponent } from './heures-supp/heures-supp.component';
import { PenalitesComponent } from './penalites/penalites.component';
import { AvanceSalairesComponent } from './avance-salaires/avance-salaires.component';
import { AvanceSalaireDetailComponent } from './avance-salaires/avance-salaire-detail/avance-salaire-detail.component'; 
import { PrimeDetailComponent } from './primes/prime-detail/prime-detail.component';
import { PenaliteDetailComponent } from './penalites/penalite-detail/penalite-detail.component';
import { HeureSuppDetailComponent } from './heures-supp/heure-supp-detail/heure-supp-detail.component';
import { PerformencesComponent } from './performences/performences.component';
import { ArchivesComponent } from './archives/archives.component'; 
import { StatutsPaieComponent } from './salaires/statuts-paie/statuts-paie.component';
import { ListPaimentsComponent } from './salaires/list-paiments/list-paiments.component';
import { PaieViewComponent } from './salaires/list-paiments/paie-view/paie-view.component';
import { FichePaieComponent } from './salaires/statuts-paie/fiche-paie/fiche-paie.component';
import { BulletinPaieComponent } from './salaires/statuts-paie/bulletin-paie/bulletin-paie.component'; 
import { RelevePaieComponent } from './salaires/releve-paie/releve-paie.component';
import { PerformenceViewComponent } from './performences/performence-view/performence-view.component';
import { PresEntrepriseComponent } from './pres-entreprise/pres-entreprise.component';
import { PresEntrepriseViewComponent } from './pres-entreprise/pres-entreprise-view/pres-entreprise-view.component';
import { DepViewComponent } from './preferences/departements/dep-view/dep-view.component';
import { FonctionViewComponent } from './preferences/fonction/fonction-view/fonction-view.component';
import { ServViewComponent } from './preferences/services/serv-view/serv-view.component';
import { TitleViewComponent } from './preferences/titles/title-view/title-view.component';
import { SiteLocationViewComponent } from './preferences/site-location/site-location-view/site-location-view.component';
import { archivesGuard, 
  avanceSalaireGuard, 
  candidaturesGuard, 
  dashboardGuard, 
  departementsGuard, 
  emailsGuard, 
  entrepriseGuard, 
  fonctionGuard, 
  heureSuppGuard, 
  horaireGuard, 
  indemniteGuard, 
  listePaiementGuard, 
  mesBulletinsGuard, 
  penaliteGuard, 
  performenceGuard, 
  personnelsGuard, 
  pointagesGuard, 
  postesGuard, 
  presEntrepriseGuard, 
  primeDiversGuard, 
  registrePresenceGuard, 
  reglagesGuard, 
  relevePaieGuard, 
  serviceGuard, 
  siteLocationGuard, 
  statutPaieGuard, 
  supportGuard, 
  syndicatGuard, 
  titresGuard } from './guard/role.guard';
import { MailSentComponent } from './mail/mail-sent/mail-sent.component';
import { CalculateComponent } from './salaires/calculate/calculate.component';
import { ReglageAdminAddComponent } from './admin/reglage-admin/reglage-admin-add/reglage-admin-add.component';
import { AbonnementAdminComponent } from './admin/abonnement-admin/abonnement-admin.component';
import { ReglageAdminComponent } from './admin/reglage-admin/reglage-admin.component';
import { AbonnementComponent } from './abonnements/abonnement/abonnement.component';
import { EnregistrementsComponent } from './auth/enregistrements/enregistrements.component';
import { NotifyComponent } from './notify/notify.component';
import { NotifyViewComponent } from './notify/notify-view/notify-view.component';
import { EntrepriseComponent } from './admin/entreprise/entreprise.component';
import { EntrepriseViewComponent } from './admin/entreprise/entreprise-view/entreprise-view.component';
import { PointageViewComponent } from './presences/pointage/pointage-view/pointage-view.component';
import { MesBulletinsComponent } from './salaires/mes-bulletins/mes-bulletins.component';
import { AbonnementAdminViewComponent } from './admin/abonnement-admin/abonnement-admin-view/abonnement-admin-view.component';
import { ProfilPresencesViewComponent } from './auth/profile/profil-presences/profil-presences-view/profil-presences-view.component';
import { HorairesComponent } from './horaires/horaires.component';
import { IndemnitesComponent } from './salaires/indemnites/indemnites.component';
import { CorbeilComponent } from './corbeil/corbeil.component';
import { CorbeilViewComponent } from './corbeil/corbeil-view/corbeil-view.component';
import { UsersComponent } from './admin/users/users.component';
import { UserViewComponent } from './admin/users/user-view/user-view.component';
import { CorporateComponent } from './preferences/corporates/corporate/corporate.component';
import { CorporateViewComponent } from './preferences/corporates/corporate-view/corporate-view.component';
import { HoraireComponent } from './horaires/horaire/horaire.component';
import { IndemniteEditComponent } from './salaires/indemnites/indemnite-edit/indemnite-edit.component';
import { IndemniteViewComponent } from './salaires/indemnites/indemnite-view/indemnite-view.component';
import { HoraireEditComponent } from './horaires/horaire-edit/horaire-edit.component';
import { PersonnelAddAdminComponent } from './personnels/personnel-add-admin/personnel-add-admin.component';
 

const routes: Routes = [
  { path: 'auth', component: AuthComponent, children: [
    { path: 'login', component: LoginComponent }, 
    { path: 'forgot-password', component: ForgotPasswordComponent }, 
    { path: 'record/et015', component: EnregistrementsComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full'},
  ]},
  { path: 'layouts', component: LayoutsComponent, children: [
    { path: 'dashboard', component: DashboardComponent, canActivate: [dashboardGuard] },
    { path: 'profile', component: ProfileComponent },
    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [dashboardGuard]},
    { path: 'personnels/:id/personnel-list', component: PersonnelListComponent, canActivate: [personnelsGuard]},
    { path: 'personnels/:id/personnel-add', component: PersonnelAddComponent, canActivate: [personnelsGuard]},
    { path: 'personnels/:id/personnel-edit', component: PersonnelEditComponent, canActivate: [personnelsGuard]},
    { path: 'personnels/:id/personnel-view', component: PersonnelViewComponent, canActivate: [personnelsGuard]},
    { path: 'personnels/personnel-add/admin', component: PersonnelAddAdminComponent, canActivate: [personnelsGuard]},
    { path: 'personnels/syndicats', component: SyndicatsComponent, canActivate: [syndicatGuard] },
    { path: 'personnels/syndicats/:id/view', component: SyndicatViewComponent, canActivate: [syndicatGuard] },
    { path: 'personnels/hors-usages', component: CorbeilComponent, canActivate: [personnelsGuard] },
    { path: 'personnels/hors-usages/:id/view', component: CorbeilViewComponent, canActivate: [personnelsGuard] },

    { path: 'preferences/reglages', component: ReglagesComponent, canActivate: [reglagesGuard] },
    { path: 'preferences/:id/fonction', component: FonctionComponent, canActivate: [fonctionGuard] },
    { path: 'preferences/fonction/:id/detail', component: FonctionViewComponent, canActivate: [fonctionGuard] },
    { path: 'preferences/:id/departements', component: DepartementsComponent, canActivate: [departementsGuard] },
    { path: 'preferences/departement/:id/detail', component: DepViewComponent, canActivate: [departementsGuard] },
    { path: 'preferences/:id/services', component: ServicesComponent, canActivate: [serviceGuard] },
    { path: 'preferences/services/:id/detail', component: ServViewComponent, canActivate: [serviceGuard] },
    { path: 'preferences/:id/titles', component: TitlesComponent, canActivate: [titresGuard] },
    { path: 'preferences/titles/:id/detail', component: TitleViewComponent, canActivate: [titresGuard] },
    { path: 'preferences/:id/site-location', component: SiteLocationComponent, canActivate: [siteLocationGuard] },
    { path: 'preferences/site-location/:id/detail', component: SiteLocationViewComponent, canActivate: [siteLocationGuard] },
    { path: 'preferences/corporates', component: CorporateComponent, canActivate: [entrepriseGuard]},
    { path: 'preferences/corporates/:id/detail', component: CorporateViewComponent, canActivate: [entrepriseGuard]},

    { path: 'presences/:id/pointage', component: PointageComponent, canActivate: [pointagesGuard] },
    { path: 'presences/pointage/:matricule', component: PointageViewComponent, canActivate: [pointagesGuard] },
    { path: 'presences/registre-presences', component: RegistrePresenceComponent, canActivate: [registrePresenceGuard] }, 
    { path: 'presences/:id/heures-supp', component: HeuresSuppComponent, canActivate: [heureSuppGuard] },
    { path: 'presences/heures-supp/:id/detail', component: HeureSuppDetailComponent, canActivate: [heureSuppGuard] },
    { path: 'presences/pointage-profil/:matricule/detail', component: ProfilPresencesViewComponent }, // C'est le lien du profil, donc pas de guard
    { path: 'presences/:id/horaires', component: HorairesComponent, children: [ 
      { path: ':horaire_id/calendar', component: HoraireComponent},
      { path: ':horaire_id/horaire-edit', component: HoraireEditComponent },
    ], canActivate: [horaireGuard]},
    { path: 'recrutements/postes', component: PostesComponent, canActivate: [postesGuard] },
    { path: 'recrutements/postes/poste-add', component: PosteAddComponent, canActivate: [postesGuard] },
    { path: 'recrutements/postes/:id/poste-edit', component: PosteEditComponent, canActivate: [postesGuard] },
    { path: 'recrutements/postes/:id/poste-view', component: PosteViewComponent, canActivate: [postesGuard] },
    { path: 'recrutements/candidatures', component: CandidaturesComponent, canActivate: [candidaturesGuard] },
    { path: 'recrutements/candidatures/:id/candidature-add', component: CandidatureAddComponent, canActivate: [candidaturesGuard] },
    { path: 'recrutements/candidatures/:id/candidature-edit', component: CandidatureEditComponent, canActivate: [candidaturesGuard] },
    { path: 'recrutements/candidatures/:id/candidature-view', component: CandidatureViewComponent, canActivate: [candidaturesGuard] },

    { path: 'salaires/:id/primes', component: PrimesComponent, canActivate: [primeDiversGuard] },
    { path: 'salaires/primes/:id/detail', component: PrimeDetailComponent, canActivate: [primeDiversGuard] },
    { path: 'salaires/:id/penalites', component: PenalitesComponent, canActivate: [penaliteGuard] },
    { path: 'salaires/penalites/:id/detail', component: PenaliteDetailComponent, canActivate: [penaliteGuard] },
    { path: 'salaires/:id/avance-salaire', component: AvanceSalairesComponent, canActivate: [avanceSalaireGuard] },
    { path: 'salaires/avance-salaire/:id/detail', component: AvanceSalaireDetailComponent, canActivate: [avanceSalaireGuard] },
    { path: 'salaires/:id/liste-paiements', component: ListPaimentsComponent, canActivate: [listePaiementGuard] },
    { path: 'salaires/liste-paiements/:id/paie-view', component: PaieViewComponent, canActivate: [listePaiementGuard] },
    { path: 'salaires/statuts-paies', component: StatutsPaieComponent, canActivate: [statutPaieGuard] },
    { path: 'salaires/mes-bulletins-salaires', component: MesBulletinsComponent, canActivate: [mesBulletinsGuard] },
    { path: 'salaires/traitement/:id/fiche-paie', component: FichePaieComponent, canActivate: [statutPaieGuard] },
    { path: 'salaires/disponible/:id/bulletin-paie', component: BulletinPaieComponent, canActivate: [statutPaieGuard] }, 
    { path: 'salaires/releve-paie', component: RelevePaieComponent, canActivate: [relevePaieGuard]},
    { path: 'salaires/:id/pres-entreprise', component: PresEntrepriseComponent, canActivate: [presEntrepriseGuard] },
    { path: 'salaires/pres-entreprise/:id/detail', component: PresEntrepriseViewComponent, canActivate: [presEntrepriseGuard] },
    { path: 'salaires/:id/indemnites', component: IndemnitesComponent, canActivate: [indemniteGuard]},
    { path: 'salaires/indemnites/traitement/:id/indemnite-paie', component: IndemniteEditComponent, canActivate: [indemniteGuard]},
    { path: 'salaires/indemnites/disponible/:id/indemnite-paie', component: IndemniteViewComponent, canActivate: [indemniteGuard]},
    { path: 'salaires/calculate', component: CalculateComponent },

    { path: ':id/performences', component: PerformencesComponent, canActivate: [performenceGuard] },
    { path: 'performences/:id/performence-view', component: PerformenceViewComponent , canActivate: [performenceGuard]},

    { path: 'archives', component: ArchivesComponent, canActivate: [archivesGuard] },

    { path: 'mail/inbox', component: InboxComponent, canActivate: [emailsGuard] },
    { path: 'mail/compose', component: ComposeComponent, canActivate: [emailsGuard] },
    { path: 'mail/read-mail', component: ReadComponent, canActivate: [emailsGuard] },
    { path: 'mail/mail-sent', component: MailSentComponent, canActivate: [emailsGuard] },

    { path: 'support/reglages-admin', component: ReglageAdminComponent, canActivate: [supportGuard]},
    { path: 'support/reglages-admin-add', component: ReglageAdminAddComponent, canActivate: [supportGuard] }, 
    { path: 'support/entreprises', component: EntrepriseComponent, canActivate: [supportGuard] },
    { path: 'support/entreprises/:id/entreprise-view', component: EntrepriseViewComponent, canActivate: [supportGuard]},
    { path: 'support/abonnements', component: AbonnementAdminComponent, canActivate: [supportGuard] },
    { path: 'support/abonnements/:id/abonnement-admin-view', component: AbonnementAdminViewComponent, canActivate: [supportGuard] },
    { path: 'support/users', component: UsersComponent, canActivate: [supportGuard]},
    { path: 'support/users/:id/user-view', component: UserViewComponent, canActivate: [supportGuard]},


    { path: 'paiements', component: AbonnementComponent },


    { path: 'notify', component: NotifyComponent },
    { path: 'notify/:matricule/:id/notify-view', component: NotifyViewComponent },
    
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  ]},

  { path: '', redirectTo: 'auth', pathMatch: 'full'},
  { path: '**', redirectTo: 'auth', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
