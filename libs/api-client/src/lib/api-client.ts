import type { PreviewIndexItem } from './preview-index-item';

export type ApiClientConfig = {
  baseUrl: string;
};

export type BranchSummary = {
  id: string;
  name: string;
  branchName?: string;
  modelVersionTag?: string;
  modelVersion?: string;
  createdBy?: string;
};

export type ChangeSummary = {
  id: string;
  branchName: string;
  status: string;
};

export type PreviewSummary = {
  id: string;
  title: string;
  lastPublishedAt?: string;
};

export interface StatisticsItem {
  Preparatory?: number;
  Retired?: number;
  Total?: number;
}

export type BranchStatistics = Record<string, StatisticsItem>;

export type IntegrityCheckComponent = {
  type?: string;
  id: string;
  label: string;
  domainType?: string;
  parentId?: string;
  modelId?: string;
};

export type IntegrityIssue = {
  component?: IntegrityCheckComponent;
  details?: string[];
};

export type IntegrityCheck = {
  checkName: string;
  description: string;
  errors: IntegrityIssue[];
};

export type ChangePaperPreviewItem = {
  name: string;
  summary: string;
  detail: string;
};

export type ChangePaperPreviewStereotype = {
  name: string;
  changes: ChangePaperPreviewItem[];
};

export type ChangePaperPreview = {
  background?: {
    reference?: string;
    type?: string;
    versionNo?: string;
    subject?: string;
    effectiveDate?: string;
    reasonForChange?: string;
    publicationDate?: string;
    background?: string;
    sponsor?: string;
    contactDetails?: string;
  };
  stereotypes: ChangePaperPreviewStereotype[];
};

export type PreviewDetail = {
  name: string;
  description?: string;
  stereotype?: string;
  [key: string]: unknown;
};

export type PreviewReference = {
  catalogueId?: string;
  name?: string;
  stereotype?: string;
  description?: string;
};

export type PreviewLinkItem = {
  catalogueId: string;
  name: string;
  stereotype: string;
  key?: string;
  relationship?: string;
};

export type ChangeLogEntry = {
  reference?: string;
  referenceUrl?: string;
  description?: string;
  implementationDate?: string;
};

export type ChangeLog = {
  headerText?: string;
  footerText?: string;
  entries?: ChangeLogEntry[];
};

export interface PreviewCodeReference {
  code: string;
  description: string;
}

export type GeneratedArtifact = {
  blob: Blob;
  filename: string;
};

export type MauroModule = {
  name: string;
  version: string;
};

export type MauroStatus = {
  [key: string]: string;
};

export type SignInPayload = {
  username: string;
  password: string;
};

export interface OpenIdConnectLoginPayload {
  openidConnectProviderId: string;
  state: string;
  sessionState: string;
  code: string;
  redirectUrl: string;
}

export type SignInRequestPayload = SignInPayload | OpenIdConnectLoginPayload;

export type SignInResult = {
  id: string;
  token?: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  pending?: boolean;
  disabled?: boolean;
  createdBy?: string;
  userRole?: string;
  needsToResetPassword?: boolean;
};

export type PublicOpenIdConnectProvider = {
  id: string;
  label: string;
  imageUrl?: string;
  authorizationEndpoint?: string;
};

const parseBody = <T>(data: unknown): T => {
  if (data && typeof data === 'object' && 'body' in data) {
    return (data as { body: T }).body;
  }

  return data as T;
};

const asJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as unknown;
  return parseBody<T>(data);
};

const withSession = (init?: RequestInit): RequestInit => ({
  ...init,
  credentials: 'include'
});

const asArtifact = async (response: Response, defaultFilename: string): Promise<GeneratedArtifact> => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const disposition = response.headers.get('content-disposition') ?? '';
  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
  const filename = filenameMatch?.[1] ?? defaultFilename;

  return {
    blob: await response.blob(),
    filename
  };
};

export class OrchestrationApiClient {
  constructor(private readonly config: ApiClientConfig) {}

  async getBranches(): Promise<BranchSummary[]> {
    const response = await fetch(`${this.config.baseUrl}/api/nhsdd/branches`, withSession());
    return asJson<BranchSummary[]>(response);
  }

  async getBranchStatistics(branchId: string): Promise<BranchStatistics> {
    const response = await fetch(
      `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/statistics`,
      withSession()
    );
    return asJson<BranchStatistics>(response);
  }

  async getIntegrityChecks(branchId: string): Promise<IntegrityCheck[]> {
    const response = await fetch(
      `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/integrityChecks`,
      withSession()
    );
    return asJson<IntegrityCheck[]>(response);
  }

  async getChanges(): Promise<ChangeSummary[]> {
    const response = await fetch(`${this.config.baseUrl}/api/changes`, withSession());
    return asJson<ChangeSummary[]>(response);
  }

  async getChangePaperPreview(branchId: string, includeDataSets: boolean): Promise<ChangePaperPreview> {
    const searchParams = new URLSearchParams({ includeDataSets: String(includeDataSets) });
    const response = await fetch(
      `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/preview/changePaper?${searchParams.toString()}`,
      withSession()
    );
    return asJson<ChangePaperPreview>(response);
  }

  async getPreviews(): Promise<PreviewSummary[]> {
    const response = await fetch(`${this.config.baseUrl}/api/preview`, withSession());
    return asJson<PreviewSummary[]>(response);
  }

  async getPreviewIndex(branchId: string, index: string): Promise<PreviewIndexItem[]> {
    const response = await fetch(
      `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/preview/${encodeURIComponent(index)}`,
      withSession()
    );
    return asJson<PreviewIndexItem[]>(response);
  }

   async getPreviewDetail(branchId: string, index: string, id: string): Promise<PreviewDetail> {
     if (!id || id === 'undefined') {
       throw new Error('Invalid preview detail ID');
     }
     const response = await fetch(
       `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/preview/${encodeURIComponent(index)}/${encodeURIComponent(id)}`,
       withSession()
     );
     return asJson<PreviewDetail>(response);
   }

   async getPreviewReferences(branchId: string, index: string, id: string): Promise<PreviewReference[]> {
     if (!id || id === 'undefined') {
       throw new Error('Invalid preview reference ID');
     }
     const response = await fetch(
       `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/preview/${encodeURIComponent(index)}/${encodeURIComponent(id)}/whereUsed`,
       withSession()
     );
     return asJson<PreviewReference[]>(response);
   }

  async generateCodeSystems(branchId: string): Promise<GeneratedArtifact> {
    const response = await fetch(
      `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/publish/codeSystem/validateBundle`,
      withSession()
    );
    return asArtifact(response, 'codesystems.zip');
  }

  async generateValueSets(branchId: string): Promise<GeneratedArtifact> {
    const response = await fetch(
      `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/publish/valueSet/validateBundle`,
      withSession()
    );
    return asArtifact(response, 'valuesets.zip');
  }

  async generateChangePaper(branchId: string, includeDataSets = false): Promise<GeneratedArtifact> {
    const url = new URL(`${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/publish/changePaper`);
    if (includeDataSets) {
      url.searchParams.set('dataSets', 'true');
    }
    const response = await fetch(url.toString(), withSession());
    return asArtifact(response, includeDataSets ? 'change-paper-with-datasets.zip' : 'change-paper.zip');
  }

  async generateWebsite(branchId: string): Promise<GeneratedArtifact> {
    const response = await fetch(
      `${this.config.baseUrl}/api/nhsdd/${encodeURIComponent(branchId)}/publish/website`,
      withSession()
    );
    return asArtifact(response, 'website.zip');
  }

  async getMauroStatus(): Promise<MauroStatus> {
    const response = await fetch(`${this.config.baseUrl}/api/admin/status`, withSession());
    return asJson<MauroStatus>(response);
  }

  async getMauroModules(): Promise<MauroModule[]> {
    const response = await fetch(`${this.config.baseUrl}/api/admin/modules`, withSession());
    return asJson<MauroModule[]>(response);
  }

  async signIn(payload: SignInRequestPayload): Promise<SignInResult> {
    const response = await fetch(`${this.config.baseUrl}/api/authentication/login`, {
      ...withSession(),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return asJson<SignInResult>(response);
  }

  async signOut(): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/api/authentication/logout`, {
      ...withSession(),
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
  }

  async getOpenIdConnectProviders(): Promise<PublicOpenIdConnectProvider[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/openidConnectProviders`, {
        ...withSession()
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json() as unknown;
      return parseBody<PublicOpenIdConnectProvider[]>(data) || [];
    } catch {
      // Silently fail if OpenID Connect is not available
      return [];
    }
  }
}

export const createOrchestrationApiClient = (baseUrl: string) => {
  return new OrchestrationApiClient({ baseUrl });
};

