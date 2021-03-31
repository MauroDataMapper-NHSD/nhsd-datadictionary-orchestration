/**
 * Copyright 2021 NHS Digital
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataDictionaryService } from '@mdm/core/data-dictionary/data-dictionary.service';
import { ProgressDialogComponent } from '@mdm/dialogs/progress-dialog/progress-dialog.component';
import { ProgressDialogOptions } from '@mdm/dialogs/progress-dialog/progress-dialog.model';
import { Branch } from '@mdm/mdm-resources/mdm-resources/adapters/nhs-data-dictionary.model';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'mdm-branch-publish',
  templateUrl: './branch-publish.component.html',
  styleUrls: ['./branch-publish.component.scss']
})
export class BranchPublishComponent implements OnInit {

  @Input() branch?: Branch;

  isBusy = false;

  constructor(
    private dataDictionary: DataDictionaryService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  generateDita() {
    if (!this.branch || this.isBusy) {
      return;
    }

    const dialogRef = this.dialog.open<ProgressDialogComponent, ProgressDialogOptions, void>(
      ProgressDialogComponent,
      {
        data: {
          title: 'DITA files',
          message: `Generating the DITA files now for the branch "${this.branch?.branchName}". This will take some time, please wait...`
        }
      });

    this.isBusy = true;

    this.dataDictionary
      .generateDita(this.branch.branchName)
      .pipe(
        finalize(() => {
          this.isBusy = false;
          dialogRef.close();
        })
      )
      .subscribe(response => {
        if (!response.body) {
          this.toastr.warning('DITA file generation finished but no files returned.');
          return;
        }

        this.toastr.success(`DITA files generated successfully for branch "${this.branch?.branchName}"`);

        const blob = new Blob(
          [response.body],
          {
            type: response.headers.get('content-type') ?? 'application/zip'
          });

        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] ?? 'dita.zip';

        fileSaver.saveAs(blob, filename);
      });
  }

  updateTerminologies() {
    if (!this.branch || this.isBusy) {
      return;
    }

    const dialogRef = this.dialog.open<ProgressDialogComponent, ProgressDialogOptions, void>(
      ProgressDialogComponent,
      {
        data: {
          title: 'Update Terminologies',
          message: 'Updating the terminologies from OntoServer. This will take some time, please wait...'
        }
      });

    this.isBusy = true;

    this.dataDictionary
      .updateTerminologies(this.branch.branchName)
      .pipe(
        finalize(() => {
          this.isBusy = false;
          dialogRef.close();
        })
      )
      .subscribe(response => {
        this.toastr.success('Updated the terminologies from OntoServer successfully.');

        // TODO: handle response
      });
  }

  uploadCodeSets() {
    if (!this.branch || this.isBusy) {
      return;
    }

    const dialogRef = this.dialog.open<ProgressDialogComponent, ProgressDialogOptions, void>(
      ProgressDialogComponent,
      {
        data: {
          title: 'Upload Code Sets',
          message: 'Uploading the code sets to OntoServer. This will take some time, please wait...'
        }
      });

    this.isBusy = true;

    this.dataDictionary
      .uploadCodeSets(this.branch.branchName)
      .pipe(
        finalize(() => {
          this.isBusy = false;
          dialogRef.close();
        })
      )
      .subscribe(response => {
        this.toastr.success('Uploaded the code sets to OntoServer successfully.');

        // TODO: handle response
      });
  }

}
