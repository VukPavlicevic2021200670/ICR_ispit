/* 
    ! Instalacija:
    https://material.angular.io/guide/getting-started

    ! Dugme / Button
    https://material.angular.io/components/button/api

    ! Ikonica
    https://material.angular.io/components/icon/overview

    ! Forme
    https://material.angular.io/components/form-field/api

    ! Input polja
    https://material.angular.io/components/input/overview

    ! Kalendar
    1. https://material.angular.io/components/datepicker/api
    2. https://material.angular.io/components/datepicker/overview#choosing-a-date-implementation-and-date-format-settings

    ! Checkbox
    https://material.angular.io/components/checkbox/api

    ! Side navigacija
    https://material.angular.io/components/sidenav/overview

    ! Toolbar navigacija
    https://material.angular.io/components/toolbar/overview

    ! Lista za nav meni
    https://material.angular.io/components/list/overview

    ! Tabovi
    https://material.angular.io/components/tabs/api

    ! Cards
    https://material.angular.io/components/card/overview

    ! Selekcija (start treninga)
    https://material.angular.io/components/select/api

    ! progress spinner
    https://material.angular.io/components/progress-spinner/api

    ! Tabele
    https://material.angular.io/components/table/overview

    ! Sort
    https://material.angular.io/components/sort/api

    ! Paginator /  Paginacija / Stranicenje
    https://material.angular.io/components/paginator/overview

    ! Dialog
    https://material.angular.io/components/dialog/api
*/

import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 


@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatTabsModule,
        MatCardModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatTabsModule,
        MatCardModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule
    ]
})

export class MaterialModule { }