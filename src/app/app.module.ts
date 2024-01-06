import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { QRCodeModule } from 'angularx-qrcode';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordDialogBox, ChangePhotoDialogBox, ProfileComponent, UpdateInfoDialogBox } from './auth/profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { PersonnelExportXLSXDialogBox, PersonnelListComponent, PersonnelUploadCSVDialogBox } from './personnels/personnel-list/personnel-list.component';
import { PersonnelAddComponent } from './personnels/personnel-add/personnel-add.component';
import { PersonnelEditComponent } from './personnels/personnel-edit/personnel-edit.component';
import { PersonnelViewComponent } from './personnels/personnel-view/personnel-view.component'; 
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DatePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from './shared/shared.module';
import { CustomizerSettingsComponent } from './customizer-settings/customizer-settings.component';
import { InfoProfileComponent } from './auth/profile/info-profile/info-profile.component'; 
import { ProfilePaieComponent } from './auth/profile/profile-paie/profile-paie.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CredentialInterceptor } from './interceptors/credential.interceptor'; 
import { InboxComponent } from './mail/inbox/inbox.component';
import { ComposeComponent } from './mail/compose/compose.component';
import { ReadComponent } from './mail/read/read.component';
import { EmailSidebarComponent } from './mail/email-sidebar/email-sidebar.component'; 
import { ErrorStateMatcher, MAT_DATE_LOCALE, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DepartementsComponent, EditDepartementDialogBox } from './preferences/departements/departements.component';
import { EditReglageDialogBox, ReglagesComponent } from './preferences/reglages/reglages.component';
import { EditTitleDialogBox, TitlesComponent } from './preferences/titles/titles.component';
import { EditFonctionDialogBox, FonctionComponent } from './preferences/fonction/fonction.component';
import { EditServiceDialogBox, ServicesComponent } from './preferences/services/services.component';
import { EditSiteLocationDialogBox, SiteLocationComponent } from './preferences/site-location/site-location.component';
import { PointageComponent } from './presences/pointage/pointage.component'; 
import { PenaliteSAddDialogBox, PresenceFormComponent } from './presences/pointage/pointage-view/presence-form/presence-form.component';
import { PresenceCalendarComponent } from './presences/pointage/pointage-view/presence-calendar/presence-calendar.component';
import { PresencePieMonthComponent } from './presences/pointage/pointage-view/presences-pie/presence-pie-month/presence-pie-month.component';
import { PresencePieYearComponent } from './presences/pointage/pointage-view/presences-pie/presence-pie-year/presence-pie-year.component';
import { PresencePieAllComponent } from './presences/pointage/pointage-view/presences-pie/presence-pie-all/presence-pie-all.component';
import { PresencesPieComponent } from './presences/pointage/pointage-view/presences-pie/presences-pie.component'; 
import { EditPresenceDialogBox, PointageTableComponent } from './presences/pointage/pointage-view/pointage-table/pointage-table.component';
import { PresenceExportXLSXDialogBox, PresenceUploadCSVDialogBox, RegistrePresenceComponent } from './presences/registre-presence/registre-presence.component';
import { SyndicatsComponent } from './syndicats/syndicats.component';
import { CandidaturesComponent } from './recrutements/candidatures/candidatures.component';
import { PostesComponent } from './recrutements/postes/postes.component';
import { PosteAddComponent } from './recrutements/postes/poste-add/poste-add.component';
import { PosteEditComponent } from './recrutements/postes/poste-edit/poste-edit.component';
import { PosteViewComponent } from './recrutements/postes/poste-view/poste-view.component';
import { CandidatureAddComponent } from './recrutements/candidatures/candidature-add/candidature-add.component';
import { CandidatureEditComponent } from './recrutements/candidatures/candidature-edit/candidature-edit.component';
import { CandidatureViewComponent } from './recrutements/candidatures/candidature-view/candidature-view.component';
import { SyndicatViewComponent } from './syndicats/syndicat-view/syndicat-view.component'; 
import { PrimeAddDialogBox, PrimesComponent } from './primes/primes.component';
import { PenaliteAddDialogBox, PenalitesComponent } from './penalites/penalites.component';
import { AvanceSalaireAddDialogBox, AvanceSalairesComponent } from './avance-salaires/avance-salaires.component';
import { HeureSuppAddDialogBox, HeuresSuppComponent } from './heures-supp/heures-supp.component';
import { PresencePointageComponent } from './presences/pointage/presence-pointage/presence-pointage.component';
import { AvanceSalaireDetailComponent, EditAvanceSalaireDialogBox } from './avance-salaires/avance-salaire-detail/avance-salaire-detail.component';
import { AvanceSalaireTableComponent } from './avance-salaires/avance-salaire-table/avance-salaire-table.component';
import { EditPrimeDialogBox, PrimeDetailComponent } from './primes/prime-detail/prime-detail.component';
import { PrimeTableComponent } from './primes/prime-detail/prime-table/prime-table.component';
import { EditPenaliteDialogBox, PenaliteDetailComponent } from './penalites/penalite-detail/penalite-detail.component';
import { PenaliteTableComponent } from './penalites/penalite-detail/penalite-table/penalite-table.component';
import { EditHeureSuppDialogBox, HeureSuppDetailComponent } from './heures-supp/heure-supp-detail/heure-supp-detail.component';
import { HeureSuppTableComponent } from './heures-supp/heure-supp-detail/heure-supp-table/heure-supp-table.component';
import { HoraireComponent, HoraireInfoDialogBox } from './horaires/horaire/horaire.component';
import { PrimeFilterComponent } from './primes/prime-filter/prime-filter.component';
import { PenaliteFilterComponent } from './penalites/penalite-filter/penalite-filter.component';
import { HeureSuppFilterComponent } from './heures-supp/heure-supp-filter/heure-supp-filter.component';
import { AvanceSalaireFilterComponent } from './avance-salaires/avance-salaire-filter/avance-salaire-filter.component';
import { PerformencesComponent } from './performences/performences.component';
import { ArchivesComponent } from './archives/archives.component'; 
import { StatutsPaieComponent } from './salaires/statuts-paie/statuts-paie.component';
import { ListPaimentsComponent } from './salaires/list-paiments/list-paiments.component';
import { PaieViewComponent } from './salaires/list-paiments/paie-view/paie-view.component';
import { RelevePaieTableComponent } from './salaires/list-paiments/paie-view/releve-paie-table/releve-paie-table.component';
import { CalculateDialog, FichePaieComponent } from './salaires/statuts-paie/fiche-paie/fiche-paie.component';
import { BulletinPaieComponent } from './salaires/statuts-paie/bulletin-paie/bulletin-paie.component';
import { NumberFormatPipe } from './pipes/number-format.pipe'; 
import { RelevePaieComponent, SalaireExportXLSXDialogBox } from './salaires/releve-paie/releve-paie.component'; 
import { PerformenceAddDialogBox, PerformenceViewComponent } from './performences/performence-view/performence-view.component';
import { HospitaliteComponent } from './performences/hospitalite/hospitalite.component';
import { TravailComponent } from './performences/travail/travail.component';
import { PonctualiteComponent } from './performences/ponctualite/ponctualite.component';
import { EditPerformenceDialogBox, PerformenceTableComponent } from './performences/performence-view/performence-table/performence-table.component'; 
import { PerformencePieComponent } from './performences/performence-view/performence-pie/performence-pie.component'; 
import { PerformencePieYearComponent } from './performences/performence-view/performence-pie/performence-pie-year/performence-pie-year.component';
import { PerformencePieAllComponent } from './performences/performence-view/performence-pie/performence-pie-all/performence-pie-all.component';
import { PresEntrepriseAddDialogBox, PresEntrepriseComponent } from './pres-entreprise/pres-entreprise.component'; 
import { DashAllComponent } from './dashboard/all/dash-all/dash-all.component'; 
import { EmployesAllComponent } from './dashboard/employes/employes-all/employes-all.component';
import { FinanceAllComponent } from './dashboard/finances/finance-all/finance-all.component';  
import { PresenceAllComponent } from './dashboard/presences/presence-all/presence-all.component';
import { AutreAllComponent } from './dashboard/autres/autre-all/autre-all.component';
import { AutreMonthComponent } from './dashboard/autres/autre-month/autre-month.component';
import { AutreYearComponent } from './dashboard/autres/autre-year/autre-year.component';
import { EditPresEntrepriseDialogBox, PresEntrepriseViewComponent } from './pres-entreprise/pres-entreprise-view/pres-entreprise-view.component';
import { DepViewComponent } from './preferences/departements/dep-view/dep-view.component';
import { FonctionViewComponent } from './preferences/fonction/fonction-view/fonction-view.component';
import { ServViewComponent } from './preferences/services/serv-view/serv-view.component';
import { SiteLocationViewComponent } from './preferences/site-location/site-location-view/site-location-view.component';
import { TitleViewComponent } from './preferences/titles/title-view/title-view.component';
import { MailSentComponent } from './mail/mail-sent/mail-sent.component';
import { CalculateComponent } from './salaires/calculate/calculate.component'; 
import { EnregistrementsComponent } from './auth/enregistrements/enregistrements.component';
import { ReglageAdminComponent } from './admin/reglage-admin/reglage-admin.component';
import { ReglageAdminAddComponent } from './admin/reglage-admin/reglage-admin-add/reglage-admin-add.component';
import { AbonnementAdminComponent } from './admin/abonnement-admin/abonnement-admin.component';
import { AbonnementComponent } from './abonnements/abonnement/abonnement.component';
import { NotificationComponent } from './notifications/notification/notification.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UpdateComponent } from './update/update.component';
import { ToasterComponent } from './toaster/toaster.component';
import { CheckUpdateService } from './shared/services/check-update.service';
import { AbonnementService } from './abonnements/abonnement.service';
import { AuthService } from './auth/auth.service';
import { AvanceSalaireService } from './avance-salaires/avance-salaire.service';
import { DashAllService } from './dashboard/all/dash-all.service';
import { EmployeService } from './dashboard/employes/employe.service';
import { FinanceService } from './dashboard/finances/finance.service';
import { PresenceService } from './presences/presence.service';
import { HeureSuppService } from './heures-supp/heure-supp.service';
import { NotificationService } from './notifications/notification.service';
import { PenaliteService } from './penalites/penalite.service';
import { PerformenceService } from './performences/performence.service';
import { PersonnelService } from './personnels/personnel.service';
import { DepartementService } from './preferences/departements/departement.service';
import { FonctionService } from './preferences/fonction/fonction.service';
import { ReglageService } from './preferences/reglages/reglage.service';
import { ServiceService } from './preferences/services/service.service';
import { SiteLocationService } from './preferences/site-location/site-location.service';
import { TitleService } from './preferences/titles/title.service';
import { PresEntrepriseService } from './pres-entreprise/pres-entreprise.service';
import { PresenceDashService } from './dashboard/presences/presence.service';
import { PrimeService } from './primes/prime.service';
import { CandidaturesService } from './recrutements/candidatures.service';
import { PostesService } from './recrutements/postes.service';
import { SalaireService } from './salaires/salaire.service';
import { NotifyComponent } from './notify/notify.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { NotifyViewComponent } from './notify/notify-view/notify-view.component';
import { EntrepriseComponent } from './admin/entreprise/entreprise.component';
import { AddAbonnementDialogBox, EditEntrepriseDialogBox, EntrepriseViewComponent } from './admin/entreprise/entreprise-view/entreprise-view.component';
import { AbonnementTableComponent } from './admin/entreprise/abonnement-table/abonnement-table.component';
import { AbonnementAdminViewComponent, EditAbonnementAdminDialogBox } from './admin/abonnement-admin/abonnement-admin-view/abonnement-admin-view.component';
import { PointageViewComponent } from './presences/pointage/pointage-view/pointage-view.component';
import { MesBulletinsComponent } from './salaires/mes-bulletins/mes-bulletins.component';
import { CumulComponent } from './performences/cumul/cumul.component';
import { ClasseurFilterComponent } from './salaires/classeur-filter/classeur-filter.component';
import { ProfilHeuresSuppComponent } from './auth/profile/profil-heures-supp/profil-heures-supp.component';
import { ProfilPresencesComponent } from './auth/profile/profil-presences/profil-presences.component';
import { ProfilPrimesComponent } from './auth/profile/profil-primes/profil-primes.component';
import { ProfilPenalitesComponent } from './auth/profile/profil-penalites/profil-penalites.component';
import { ProfilPerformanceComponent } from './auth/profile/profil-performance/profil-performance.component';
import { ProfilAvancesSalaireComponent } from './auth/profile/profil-avances-salaire/profil-avances-salaire.component';
import { ProfilPresencesViewComponent } from './auth/profile/profil-presences/profil-presences-view/profil-presences-view.component';
import { ClasseurFilterDispComponent } from './salaires/classeur-filter-disp/classeur-filter-disp.component';
import { HorairesComponent } from './horaires/horaires.component';
import { HoraireViewComponent } from './horaires/horaire-view/horaire-view.component';
import { IndemnitesComponent } from './salaires/indemnites/indemnites.component'; 
import { CorbeilComponent } from './corbeil/corbeil.component';
import { CorbeilViewComponent } from './corbeil/corbeil-view/corbeil-view.component';
import { UsersComponent } from './admin/users/users.component';
import { UserViewComponent } from './admin/users/user-view/user-view.component';
import { CoporateAddDialogBox, CorporateComponent } from './preferences/corporates/corporate/corporate.component';
import { CorporateViewComponent, EditCorporateDialogBox } from './preferences/corporates/corporate-view/corporate-view.component';
import { CorporateReglageComponent, EditCorporateReglageDialogBox } from './preferences/corporate-reglage/corporate-reglage.component';
import { HoraireAddDialogBox, HoraireSidebarComponent } from './horaires/horaire-sidebar/horaire-sidebar.component';
import { IndemniteEditComponent } from './salaires/indemnites/indemnite-edit/indemnite-edit.component';
import { IndemniteViewComponent } from './salaires/indemnites/indemnite-view/indemnite-view.component';
import { EditIndemniteDialogBox, IdemniteContentComponent } from './salaires/indemnites/idemnite-content/idemnite-content.component';
import { FilterPipe } from './pipes/filter.pipe';
import { HoraireEditComponent } from './horaires/horaire-edit/horaire-edit.component';
import { ShiftOneComponent } from './horaires/horaire/shift-one/shift-one.component';
import { ShiftTreeComponent } from './horaires/horaire/shift-tree/shift-tree.component';
import { ShiftTwoComponent } from './horaires/horaire/shift-two/shift-two.component';
import { PersonnelAddAdminComponent } from './personnels/personnel-add-admin/personnel-add-admin.component';

 
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    InternalErrorComponent,
    NotFoundComponent,
    SidebarComponent,
    CustomizerSettingsComponent,
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    DashboardComponent,
    LayoutsComponent,
    PersonnelListComponent,
    PersonnelAddComponent,
    PersonnelEditComponent,
    PersonnelViewComponent,
    InfoProfileComponent, 
    ProfilePaieComponent, 
    ChangePasswordDialogBox,
    ChangePhotoDialogBox, 
    InboxComponent,
    ComposeComponent,
    ReadComponent,
    EmailSidebarComponent,
    DepartementsComponent,
    ReglagesComponent,
    TitlesComponent,
    FonctionComponent,
    ServicesComponent,
    SiteLocationComponent,
    EditDepartementDialogBox,
    EditFonctionDialogBox,
    EditServiceDialogBox,
    EditTitleDialogBox,
    EditSiteLocationDialogBox,
    EditReglageDialogBox, 
    PointageComponent,
    PresenceFormComponent,
    PresenceCalendarComponent, 
    PresencePieMonthComponent, 
    PresencePieYearComponent, 
    PresencePieAllComponent, 
    PresencesPieComponent,
    PointageTableComponent,
    RegistrePresenceComponent,
    SyndicatsComponent,
    CandidaturesComponent,
    PostesComponent,
    PosteAddComponent,
    PosteEditComponent,
    PosteViewComponent,
    CandidatureAddComponent,
    CandidatureEditComponent,
    CandidatureViewComponent,
    SyndicatViewComponent,
    PrimesComponent,
    PenalitesComponent,
    AvanceSalairesComponent,
    HeuresSuppComponent,
    PresencePointageComponent,
    EditPresenceDialogBox,
    AvanceSalaireDetailComponent,
    AvanceSalaireAddDialogBox,
    AvanceSalaireTableComponent,
    EditAvanceSalaireDialogBox,
    PrimeAddDialogBox,
    PrimeDetailComponent,
    PrimeTableComponent,
    EditPrimeDialogBox,
    PenaliteDetailComponent,
    PenaliteTableComponent,
    PenaliteAddDialogBox,
    EditPenaliteDialogBox,
    HeureSuppDetailComponent,
    HeureSuppTableComponent,
    HeureSuppAddDialogBox,
    EditHeureSuppDialogBox,
    HoraireComponent,
    PrimeFilterComponent,
    PenaliteFilterComponent,
    HeureSuppFilterComponent,
    AvanceSalaireFilterComponent,
    PerformencesComponent,
    ArchivesComponent, 
    StatutsPaieComponent,
    ListPaimentsComponent,
    PaieViewComponent,
    RelevePaieTableComponent,
    FichePaieComponent,
    BulletinPaieComponent,
    PenaliteSAddDialogBox,
    NumberFormatPipe,
    DateAgoPipe,
    RelevePaieComponent, 
    PerformenceViewComponent,
    PerformenceAddDialogBox,
    HospitaliteComponent,
    TravailComponent,
    PonctualiteComponent,
    EditPerformenceDialogBox,
    PerformenceTableComponent, 
    PerformencePieComponent, 
    PerformencePieYearComponent,
    PerformencePieAllComponent,
    PresEntrepriseComponent, 
    DashAllComponent, 
    EmployesAllComponent,
    FinanceAllComponent,
    PresenceAllComponent,
    AutreAllComponent,
    AutreMonthComponent,
    AutreYearComponent,
    PresEntrepriseAddDialogBox,
    PresEntrepriseViewComponent,
    EditPresEntrepriseDialogBox,
    DepViewComponent,
    FonctionViewComponent,
    ServViewComponent,
    SiteLocationViewComponent,
    TitleViewComponent,
    PersonnelUploadCSVDialogBox,
    PersonnelExportXLSXDialogBox,
    SalaireExportXLSXDialogBox,
    PresenceExportXLSXDialogBox,
    MailSentComponent,
    CalculateComponent, 
    CalculateDialog, 
    EnregistrementsComponent, 
    ReglageAdminComponent, 
    ReglageAdminAddComponent, 
    AbonnementAdminComponent, 
    AbonnementComponent, 
    NotificationComponent, 
    UpdateComponent, 
    ToasterComponent, 
    NotifyComponent, 
    NotifyViewComponent,
    PresenceUploadCSVDialogBox,
    EntrepriseComponent,
    EntrepriseViewComponent,
    EditEntrepriseDialogBox,
    AbonnementTableComponent,
    AbonnementAdminViewComponent, 
    PointageViewComponent, 
    MesBulletinsComponent, 
    CumulComponent,
    AddAbonnementDialogBox,
    EditAbonnementAdminDialogBox,
    ClasseurFilterComponent,
    ProfilHeuresSuppComponent,
    ProfilPresencesComponent,
    ProfilPrimesComponent,
    ProfilPenalitesComponent,
    ProfilPerformanceComponent,
    ProfilAvancesSalaireComponent,
    ProfilPresencesViewComponent, 
    ClasseurFilterDispComponent,
    HorairesComponent, 
    HoraireViewComponent, 
    IndemnitesComponent,
    CorbeilComponent, 
    CorbeilViewComponent, 
    UsersComponent, 
    UserViewComponent,
    UpdateInfoDialogBox,
    HoraireAddDialogBox,
    CorporateComponent,
    CorporateViewComponent,
    EditCorporateDialogBox,
    CoporateAddDialogBox,
    CorporateReglageComponent,
    EditCorporateReglageDialogBox,
    HoraireSidebarComponent,
    HoraireInfoDialogBox,
    IndemniteEditComponent,
    IndemniteViewComponent,
    IdemniteContentComponent,
    EditIndemniteDialogBox,
    FilterPipe,
    HoraireEditComponent,
    ShiftOneComponent,
    ShiftTreeComponent,
    ShiftTwoComponent,
    PersonnelAddAdminComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
    }),
    QuillModule.forRoot(),
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    QRCodeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }), 
    NgxMaterialTimepickerModule.setOpts('fr-FR', 'latn'),
    NgxSkeletonLoaderModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    provideAnimations(), // required animations providers
    provideToastr(),
    NumberFormatPipe,
    DateAgoPipe,
    CheckUpdateService,

    AbonnementService,
    AuthService,
    AvanceSalaireService,
    DashAllService,
    EmployeService,
    FinanceService,
    PresenceDashService,
    HeureSuppService,
    NotificationService,
    PenaliteService,
    PerformenceService,
    PersonnelService,
    DepartementService,
    FonctionService,
    ReglageService,
    ServiceService,
    SiteLocationService,
    TitleService,
    PresEntrepriseService,
    PresenceService,
    PrimeService,
    CandidaturesService,
    PostesService,
    SalaireService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
