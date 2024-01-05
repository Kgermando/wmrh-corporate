import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { HoraireService } from '../horaire.service';
import { ToastrService } from 'ngx-toastr';
import { PersonnelService } from 'src/app/personnels/personnel.service';
import { formatDate } from '@angular/common';
import { HoraireModel } from '../models/horaire-model';

@Component({
  selector: 'app-horaire-add',
  templateUrl: './horaire-add.component.html',
  styleUrls: ['./horaire-add.component.scss']
})
export class HoraireAddComponent implements OnInit {
  isLoading: boolean = false; 
  currentUser: PersonnelModel | any; 
  horaire: HoraireModel;
  formGroup!: FormGroup;
  formGroup_1!: FormGroup;
  formGroup_2!: FormGroup;
  formGroup_3!: FormGroup;

  personnelList: PersonnelModel[] = [];

  formDate1Group!: FormGroup;
  formDate2Group!: FormGroup;
  formDate3Group!: FormGroup;

  date_horaire_1: any;
  date_horaire_2: any;
  date_horaire_3: any;

  date_horaire_1List: any[] = [];
  date_horaire_2List: any[] = [];
  date_horaire_3List: any[] = [];

  id: number;
 
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private personnelService: PersonnelService,
    private horairervice: HoraireService, 
    private toastr: ToastrService) {}



  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.horairervice.get(this.id).subscribe(item => { 
          this.horaire = item;
          this.personnelService.getAll(this.currentUser.code_entreprise).subscribe(res => {
            this.personnelList = res;
          });
          this.date_horaire_1List = item.date_shift_1;
          this.formGroup.patchValue({
            name_horaire: this.capitalizeTest(item.name_horaire),
            signature: this.currentUser.matricule, 
            update_created: new Date()
          });
          this.formGroup_1.patchValue({ 
            personnel_shift_1: item.personnel_shift_1,
            date_shift_1: this.date_horaire_1List,
            time_1: item.time_1,
            signature: this.currentUser.matricule,
            update_created: new Date()
          });
          this.formGroup_2.patchValue({ 
            personnel_shift_2: item.personnel_shift_2,
            date_shift_2: item.date_shift_2, 
            time_2: item.time_2,
            signature: this.currentUser.matricule,
            update_created: new Date()
          });
          this.formGroup_3.patchValue({ 
            personnel_shift_3: item.personnel_shift_3,
            date_shift_3: item.date_shift_3,
            time_3: item.time_3,
            signature: this.currentUser.matricule,
            update_created: new Date()
          });
        }
      ); 
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      } 
    });

    this.formGroup = this._formBuilder.group({
      name_horaire: ['', Validators.required],
    });

    this.formGroup_1 = this._formBuilder.group({
      personnel_shift_1: [''],
      time_1: [''],
    });

    this.formGroup_2 = this._formBuilder.group({
      personnel_shift_2: [''],
      time_2: [''],
    });

    this.formGroup_3 = this._formBuilder.group({
      personnel_shift_3: [''],
      time_3: [''],
    });


    this.formDate1Group = this._formBuilder.group({
      date_horaire_1: new FormControl(''),
    });
    this.formDate2Group = this._formBuilder.group({
      date_horaire_2: new FormControl(''),
    }); 
    this.formDate3Group = this._formBuilder.group({
      date_horaire_3: new FormControl(''),
    });

    this.onChange();
  }

  onChange() {
    this.formDate1Group.valueChanges.subscribe(val => {
      this.date_horaire_1 = val.date_horaire_1;
      this.date_horaire_1List.push(formatDate(this.date_horaire_1, 'dd-MM-yyyy', 'en-US'));
      console.log('date_horaire_1List', this.date_horaire_1List);
    });
    this.formDate2Group.valueChanges.subscribe(val => {
      this.date_horaire_2 = val.date_horaire_2;
      this.date_horaire_2List.push(this.date_horaire_2);
      console.log('date_horaire_2List', this.date_horaire_2List);
    });
    this.formDate3Group.valueChanges.subscribe(val => {
      this.date_horaire_3 = val.date_horaire_1;
      this.date_horaire_3List.push(this.date_horaire_3);
      console.log('date_horaire_3List', this.date_horaire_3List);
    });
  }

  removeAtDate1(date: string) { 
    const index = this.date_horaire_1List.indexOf(date);
    console.log(index); // 👉️ 1

    if (index !== -1) {
      this.date_horaire_1List.splice(index, 1);
    }

    console.log('this.date_horaire_1List', this.date_horaire_1List);
  }
 

  onSubmit() {
    try {
      this.isLoading = true;
      var body = {
        name_horaire: this.capitalizeTest(this.formGroup.value.name_horaire),
        signature: this.currentUser.matricule,
        created: new Date(),
        update_created: new Date(),
        entreprise: this.currentUser.entreprise,
        code_entreprise: this.currentUser.code_entreprise
      };
      this.horairervice.update(this.id, body)
      .subscribe({
        next: () => {
          this.toastr.success('Modification du titre!', 'Success!');
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      }); 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit1() {
    try {
      this.isLoading = true;
      var body = {
        personnel_shift_1: this.formGroup_1.value.personnel_shift_1,
        date_shift_1: this.date_horaire_1List,
        time_1: this.formGroup_1.value.time_1,
        signature: this.currentUser.matricule,
        created: new Date(),
        update_created: new Date(),
        entreprise: this.currentUser.entreprise,
        code_entreprise: this.currentUser.code_entreprise
      };
      this.horairervice.update(this.id, body)
      .subscribe({
        next: () => {
          this.toastr.success('Horaire du shift 1 ajouté!', 'Success!');
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      }); 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit2() {
    try {
      this.isLoading = true;
      var body = {
        personnel_shift_2: this.formGroup_2.value.personnel_shift_2,
        date_shift_2: this.date_horaire_2List,
        time_2: this.formGroup_2.value.time_2,
        signature: this.currentUser.matricule,
        created: new Date(),
        update_created: new Date(),
        entreprise: this.currentUser.entreprise,
        code_entreprise: this.currentUser.code_entreprise
      };
      this.horairervice.update(this.id, body)
      .subscribe({
        next: () => {
          this.toastr.success('Horaire du shift 2 ajouté!', 'Success!');
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      }); 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }
  onSubmit3() {
    try {
      this.isLoading = true;
      var body = {
        personnel_shift_3: this.formGroup_3.value.personnel_shift_3,
        date_shift_3: this.date_horaire_3List,
        time_3: this.formGroup_3.value.time_3,
        signature: this.currentUser.matricule,
        created: new Date(),
        update_created: new Date(),
        entreprise: this.currentUser.entreprise,
        code_entreprise: this.currentUser.code_entreprise
      };
      this.horairervice.update(this.id, body)
      .subscribe({
        next: () => {
          this.toastr.success('Horaire du shift 3 ajouté!', 'Success!');
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      }); 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }


}


