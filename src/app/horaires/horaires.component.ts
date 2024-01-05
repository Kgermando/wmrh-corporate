import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonnelModel } from '../personnels/models/personnel-model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HoraireService } from './horaire.service';
import { HoraireModel } from './models/horaire-model';

@Component({
  selector: 'app-horaires',
  templateUrl: './horaires.component.html',
  styleUrls: ['./horaires.component.scss']
})
export class HorairesComponent {
  isLoading = false;
  
  currentUser: PersonnelModel | any;

  horaireList: HoraireModel[] = [];

  constructor(
    private router: Router,
      private authService: AuthService,  
      private horairervice: HoraireService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.horairervice.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.horaireList = res;  
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

  } 

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(HoraireAddDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 
}



@Component({
  selector: 'horaire-dialog',
  templateUrl: './horaire-add.html',
})
export class HoraireAddDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;    

  constructor( 
      public dialogRef: MatDialogRef<HoraireAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private horairervice: HoraireService,
  ) {}
  


  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
    
    this.formGroup = this.formBuilder.group({
      name_horaire: ['', Validators.required],
    });
 
  } 


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          name_horaire: this.capitalizeTest(this.formGroup.value.name_horaire),
          personnel_shift_1: [],
          date_shift_1: [],
          time_1: '-',
          personnel_shift_2: [],  
          date_shift_2: [],
          time_2: '-',
          personnel_shift_3: [],
          date_shift_3: [],
          time_3: '-',
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.horairervice.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Success!', 'Ajouté avec succès!'); 
            this.close();
            this.router.navigate(['/layouts/horaires', res['id'], 'horaire-edit']);
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      } 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  close(){
      this.dialogRef.close(true);
  } 

  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

}
