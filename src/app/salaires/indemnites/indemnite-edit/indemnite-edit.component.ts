import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { IndemniteService } from '../indemnite.service';  
import { IndemniteModel } from '../models/indemnite.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { CalculateDialog } from '../../statuts-paie/fiche-paie/fiche-paie.component';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import jsPDF from "jspdf";
// import html2canvas from 'html2canvas';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { monnaieDataList } from 'src/app/shared/tools/monnaie-list';
import { IdemniteContentService } from '../idemnite-content.service';
import { EditIndemniteDialogBox } from '../idemnite-content/idemnite-content.component';
import { IndemniteContentModel } from '../models/indemnite-content.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-indemnite-edit',
  templateUrl: './indemnite-edit.component.html',
  styleUrls: ['./indemnite-edit.component.scss']
})
export class IndemniteEditComponent {
  isLoading = false;

  formGroup!: FormGroup;
  content: FormArray;

  idemniteContentList: IndemniteContentModel[] = [];

  currentUser: PersonnelModel | any; 
  isActive: boolean = false;

  id: number;
  indemnite: IndemniteModel;
  preference: PreferenceModel;
  monnaieList = monnaieDataList;
  monnaie: string;

  @ViewChild('htmlData', { static: false}) htmlData!: ElementRef;

  total = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute, 
    private indemniteService: IndemniteService,
    private idemniteContentService: IdemniteContentService,
    private reglageService: ReglageService,
    public dialog: MatDialog,
    private toastr: ToastrService, 
  ) {}


  ngOnInit(): void { 
    this.id = this.route.snapshot.params['id'];
  
    this.formGroup = this.formBuilder.group({
      intitule: [''],
      monnaie: [''],
    });
  
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.indemniteService.refreshData$.subscribe(() => {
          this.getData(this.currentUser.code_entreprise);
        });
        this.getData(this.currentUser.code_entreprise);
  
        this.idemniteContentService.refreshData$.subscribe(() => {
          this.getIndemniteContent();
        });
        this.getIndemniteContent();
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  getData(code_entreprise: string) {
    this.indemniteService.get(this.id).subscribe(item => {
      this.indemnite = item;
      this.reglageService.preference(code_entreprise).subscribe(reglage => {
        this.preference = reglage;
        this.monnaie = this.indemnite.monnaie;
        this.formGroup.patchValue({
          intitule: this.capitalizeText(this.indemnite.intitule),
          monnaie: this.indemnite.monnaie,
          taux_dollard: this.indemnite.taux_dollard,
          statut: this.indemnite.statut,
          signature: this.currentUser.matricule,
          update_created: new Date()
        }); 
      }); 
    });
  }

  getIndemniteContent() {
    this.idemniteContentService.getAllIndemniteByID(this.id).subscribe(res => {
      this.idemniteContentList = res;
      this.total = this.idemniteContentList.reduce(function(sum, value){
        return sum + parseFloat(value.montant); // montant
       }, 0); 
    });
  }

  public toggle(event: MatSlideToggleChange) {
    this.isActive = event.checked;
  }  

  onChange(event:any) {
    this.monnaie = event.value;
  }



  onSubmit() {
    try {
      this.isLoading = true;
      var body = {
        intitule: this.capitalizeText(this.formGroup.value.intitule),
        statut: this.isActive ? 'Disponible' : 'Traitement', 
        taux_dollard: this.preference.taux_dollard,
        monnaie: this.monnaie,
        total_a_payer: this.total,
        signature: this.currentUser.matricule,
        created: new Date(),
        update_created: new Date(),
        entreprise: this.currentUser.entreprise,
        code_entreprise: this.currentUser.code_entreprise,
      };
      this.indemniteService.update(this.id, body).subscribe({
        next: () => {
          this.toastr.success('Document enregistré!', 'Success!');
          this.router.navigate(['/layouts/salaires/indemnites']);
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      });
      // this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }


  deleteItem(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { 
      this.idemniteContentService.delete(id).subscribe({
        next:  res => {
          this.toastr.info('Retirer avec succès!', 'Supprimée!');
          // window.location.reload(); 
        },
        error: err => { 
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          console.log(err);
        }
      });
    }
  }


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { 
      this.indemniteService.delete(id).subscribe({
        next:  res => {
          this.toastr.info('Supprimé avec succès!', 'Supprimée!');
          this.router.navigate(['/layouts/salaires/indemnites']);
        },
        error: err => { 
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          console.log(err);
        }
      });
    }
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditIndemniteDialogBox, {
      width: '600px', 
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 

  public openPDF(): void {
    let pdf = new jsPDF("p", "pt", "a4");
    var dateNow = new Date();
    var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
    pdf.html(this.htmlData.nativeElement, {
      callback: (pdf) => {
        pdf.addPage("a4", "p")
        pdf.save(`Indemnite-${dateNowFormat}.pdf`)
      }
    });
  }


  openDialog() {
      this.dialog.open(CalculateDialog, { disableClose: true });
  }
  


  capitalizeText(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }
}
