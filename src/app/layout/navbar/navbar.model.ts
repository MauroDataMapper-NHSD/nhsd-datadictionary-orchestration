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

 /**
  * Represents a link to appear in the `NavbarComponent`.
  */
export interface NavbarLink {
  /**
   * The label to appear for the link.
   */
  label: string;

  /**
   * The UI-Router sref to route to the correct state.
   */
  uiSref: string;
  
  /**
   * The name of the font-awesome icon to optionally use.
   */
  icon?: string;
}

/**
 * Represents a group of `NavbarLink` objects.
 */
export interface NavbarLinkGroup {
  /**
   * The label for the group name.
   */
  label: string;

  /** 
   * The links to display in the group.
   */
  links: NavbarLink[];

  /**
   * State if this group is the main navigation group. If `true` then this will appear in the top navbar section 
   * in full screen mode.
   */
  isMain?: boolean;
}