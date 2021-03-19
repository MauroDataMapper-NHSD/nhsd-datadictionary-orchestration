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

import { Ng2StateDeclaration } from "@uirouter/angular";
import { NotAuthorizedComponent } from "./not-authorized/not-authorized.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NotImplementedComponent } from "./not-implemented/not-implemented.component";
import { ServerErrorComponent } from "./server-error/server-error.component";

export const states: Ng2StateDeclaration[] = [
  {
    name: 'app.container.notImplemented',
    url: '/not-implemented',
    component: NotImplementedComponent
  },
  {
    name: 'app.container.notAuthorized',
    url: '/not-authorized',
    component: NotAuthorizedComponent
  },
  {
    name: 'app.container.serverError',
    url: '/server-error',
    component: ServerErrorComponent
  },
  {
    name: 'app.container.notFound',
    url: '/not-found',
    component: NotFoundComponent
  },
];