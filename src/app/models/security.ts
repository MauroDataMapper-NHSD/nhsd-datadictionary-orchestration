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

import { MdmResourcesResponse } from "@mdm/services/resources/mdm-resources.model";

export interface SignInParameters {
  username: string;
  password: string;
}

export interface SignInResult {
  id: string;
  token?: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  pending: boolean;
  disabled: boolean;
  createdBy: string;
  userRole?: string;
  needsToResetPassword?: boolean;
}

export interface AdministrationSessionResult {
  applicationAdministrationSession: boolean;
}

export type SignInResponse = MdmResourcesResponse<SignInResult>;
export type AdministrationSessionResponse = MdmResourcesResponse<AdministrationSessionResult>;