/*
Copyright 2021-2024 NHS England

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
*/
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiProperty, ApiPropertyIndexResponse } from '@maurodatamapper/mdm-resources';
import { MdmResourcesService } from '@mdm/mdm-resources/mdm-resources/mdm-resources.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {
  useOpenIdConnect = false;

  constructor(
    private endpoints: MdmResourcesService,
    private toastr: ToastrService
  ) {
    this.setFeatures([]);
    this.loadFromServer();
  }

  loadFromServer() {
    this.endpoints.apiProperties
      .listPublic()
      .pipe(
        catchError(() => {
          this.toastr.error(
            'There was a problem getting the configuration properties for features.'
          );
          return EMPTY;
        })
      )
      .subscribe((response: ApiPropertyIndexResponse) => {
        const featureFlags = response.body.items.filter(
          (prop) => prop.category === 'Features'
        );
        this.setFeatures(featureFlags);
      });
  }

  private setFeatures(properties: ApiProperty[]) {
    this.useOpenIdConnect = this.getBooleanValue(
      properties,
      'feature.use_open_id_connect',
      environment.features.useOpenIdConnect
    );
  }

  private getBooleanValue(
    properties: ApiProperty[],
    key: string,
    defaultValue: boolean
  ): boolean {
    const feature = properties.find((prop) => prop.key === key);
    return feature ? feature.value === 'true' : defaultValue;
  }
}
