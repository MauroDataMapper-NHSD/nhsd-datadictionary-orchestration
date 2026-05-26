import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppLayout, PublishMenuAction } from 'ui';
import {
  MauroModule,
  MauroStatus,
  OrchestrationApiClient,
  PublicOpenIdConnectProvider
} from 'api-client';
import { notifications } from '@mantine/notifications';
import { saveAs } from 'file-saver';
import { clearUserSession, getOpenIdConnectRedirectUri, persistUserSession } from './auth';
import { OpenIdConnectCallbackPage } from './openid-connect-callback';
import {
  ErrorStatePage,
  HomePage,
  PreviewDefaultPage,
  PreviewDetailPage,
  PreviewHomePage,
  PreviewIndexPage
} from './features';
import {
  ROUTES,
  STORAGE_KEYS,
  API_CONFIG,
  PATTERNS,
  ERROR_MESSAGES,
  NOTIFICATION_TITLES,
  NOTIFICATION_MESSAGES
} from './constants';

const appVersion = import.meta.env.VITE_APP_VERSION ?? '1.0.0';
const mauroBaseUrl = import.meta.env.VITE_MAURO_BASE_URL ?? API_CONFIG.DEFAULT_BASE_URL;

const apiClient = new OrchestrationApiClient({ baseUrl: mauroBaseUrl });

export function App(): JSX.Element {
  const [openIdConnectProviders, setOpenIdConnectProviders] = useState<PublicOpenIdConnectProvider[]>([]);
  const [branches, setBranches] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.SELECTED_BRANCH_ID)
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load OpenID Connect providers
    const loadProviders = async () => {
      try {
        const providers = await apiClient.getOpenIdConnectProviders();
        setOpenIdConnectProviders(providers);
      } catch (err) {
        console.error('Failed to load OpenID Connect providers:', err);
      }
    };

    loadProviders();
  }, []);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const items = await apiClient.getBranches();
        setBranches(
          items.map((branch) => ({
            id: branch.id,
            label: branch.versionDisplay ?? branch.branchName ?? branch.name ?? branch.id ?? 'Unnamed branch'
          }))
        );
      } catch {
        setBranches([]);
      }
    };

    loadBranches();
  }, []);

  const handleSignOut = async () => {
    clearUserSession();
    localStorage.removeItem(STORAGE_KEYS.SELECTED_BRANCH_ID);
    setSelectedBranchId(null);

    try {
      await apiClient.signOut();
    } catch (err) {
      console.error('Failed to sign out cleanly:', err);
    }

    navigate(ROUTES.HOME, { replace: true });
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      const result = await apiClient.signIn({ username, password });
      persistUserSession(result);
      navigate(ROUTES.PREVIEW, { replace: true, state: { showInitialBranchPicker: true } });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.SIGN_IN_FAILED;
      throw new Error(errorMessage);
    }
  };

  const handleOpenIdConnect = async (provider: PublicOpenIdConnectProvider) => {
    if (!provider.authorizationEndpoint) {
      throw new Error(`Unable to authenticate with ${provider.label} because of a missing endpoint.`);
    }

    localStorage.setItem(STORAGE_KEYS.OPENID_CONNECT_PROVIDER_ID, provider.id);

    const redirectUrl = getOpenIdConnectRedirectUri();
    const authUrl = new URL(provider.authorizationEndpoint);
    authUrl.searchParams.set('redirect_uri', redirectUrl);

    window.location.href = authUrl.toString();
  };

  useEffect(() => {
    const pathBranchMatch = location.pathname.match(PATTERNS.PREVIEW_BRANCH_PATH);
    const branchIdFromPath = pathBranchMatch?.[1] ?? null;

    if (branchIdFromPath) {
      setSelectedBranchId(branchIdFromPath);
      localStorage.setItem(STORAGE_KEYS.SELECTED_BRANCH_ID, branchIdFromPath);
    }
  }, [location.pathname]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    localStorage.setItem(STORAGE_KEYS.SELECTED_BRANCH_ID, branchId);

    navigate(`${ROUTES.PREVIEW}/${branchId}`);
  };

  const handleLoadStatistics = async (branchId: string) => {
    const stats = await apiClient.getBranchStatistics(branchId);

    return Object.entries(stats).map(([name, values]) => ({
      name,
      preparatory: values.Preparatory ?? 0,
      retired: values.Retired ?? 0,
      total: values.Total ?? 0
    }));
  };

  const handleLoadIntegrityChecks = async (branchId: string) => {
    const checks = await apiClient.getIntegrityChecks(branchId);

    return checks.map((check) => ({
      checkName: check.checkName,
      description: check.description,
      errors: (check.errors ?? []).map((error) => ({
        component: error.component
          ? {
              id: error.component.id,
              label: error.component.label,
              domainType: error.component.domainType,
              modelId: error.component.modelId,
              parentId: error.component.parentId
            }
          : undefined,
        details: error.details ?? []
      }))
    }));
  };

  const handleRunChangePaperPreview = async (branchId: string, includeDataSets: boolean) => {
    return apiClient.getChangePaperPreview(branchId, includeDataSets);
  };

  const handleLoadAbout = async () => {
    const [status, modules] = await Promise.all([
      apiClient.getMauroStatus(),
      apiClient.getMauroModules()
    ]);
    const typedStatus = status as MauroStatus;
    const typedModules = modules as MauroModule[];
    return {
      mauroVersion: typedStatus['Mauro Data Mapper Version'] ?? 'Unknown',
      pluginVersion:
        typedModules.find((m) => m.name === API_CONFIG.MAURO_MODULE_NAME)?.version ?? 'Unknown'
    };
  };

  const showPublishNotification = (branchLabel: string, action: PublishMenuAction, success: boolean) => {
    if (!success) {
      notifications.show({
        color: 'red',
        title: NOTIFICATION_TITLES.GENERATION_FAILED,
        message: ERROR_MESSAGES.PUBLISH_FAILED.replace('{branch}', branchLabel)
      });
      return;
    }

    const titleMap: Record<PublishMenuAction, string> = {
      codeSystems: NOTIFICATION_TITLES.CODE_SYSTEMS_GENERATED,
      valueSets: NOTIFICATION_TITLES.VALUE_SETS_GENERATED,
      changePaper: NOTIFICATION_TITLES.CHANGE_PAPER_GENERATED,
      changePaperWithDataSet: NOTIFICATION_TITLES.CHANGE_PAPER_GENERATED,
      website: NOTIFICATION_TITLES.WEBSITE_GENERATED
    };

    const messageMap: Record<PublishMenuAction, string> = {
      codeSystems: NOTIFICATION_MESSAGES.CODE_SYSTEMS_GENERATED(branchLabel),
      valueSets: NOTIFICATION_MESSAGES.VALUE_SETS_GENERATED(branchLabel),
      changePaper: NOTIFICATION_MESSAGES.CHANGE_PAPER_GENERATED(branchLabel),
      changePaperWithDataSet: NOTIFICATION_MESSAGES.CHANGE_PAPER_WITH_DATASET_GENERATED(branchLabel),
      website: NOTIFICATION_MESSAGES.WEBSITE_GENERATED(branchLabel)
    };

    notifications.show({
      color: 'green',
      title: titleMap[action],
      message: messageMap[action]
    });
  };

  const handleGeneratePublish = async (branchId: string, action: PublishMenuAction) => {
    const branchLabel = branches.find((branch) => branch.id === branchId)?.label ?? branchId;

    try {
      let artifact;

      switch (action) {
        case 'codeSystems':
          artifact = await apiClient.generateCodeSystems(branchId);
          break;
        case 'valueSets':
          artifact = await apiClient.generateValueSets(branchId);
          break;
        case 'changePaper':
          artifact = await apiClient.generateChangePaper(branchId, false);
          break;
        case 'changePaperWithDataSet':
          artifact = await apiClient.generateChangePaper(branchId, true);
          break;
        case 'website':
          artifact = await apiClient.generateWebsite(branchId);
          break;
        default:
          throw new Error(`Unknown publish action: ${action}`);
      }

      saveAs(artifact.blob, artifact.filename);
      showPublishNotification(branchLabel, action, true);
    } catch {
      showPublishNotification(branchLabel, action, false);
      throw new Error('Publish action failed');
    }
  };

  const showInitialBranchPicker =
    location.pathname === '/preview' &&
    ((location.state as { showInitialBranchPicker?: boolean } | null)?.showInitialBranchPicker === true);

  return (
    <AppLayout
      appTitle="Data Dictionary Orchestrator"
      version={appVersion}
      links={[]}
      branchOptions={branches.map((branch) => ({ value: branch.id, label: branch.label }))}
      selectedBranchId={selectedBranchId}
      onBranchChange={handleBranchChange}
      onLoadStatistics={handleLoadStatistics}
      onLoadIntegrityChecks={handleLoadIntegrityChecks}
      onRunChangePaperPreview={handleRunChangePaperPreview}
      onGeneratePublish={handleGeneratePublish}
      onLoadAbout={handleLoadAbout}
      hideBranchSelector={showInitialBranchPicker}
      signInHref={mauroBaseUrl}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
      onOpenIdConnect={handleOpenIdConnect}
      openIdConnectProviders={openIdConnectProviders}
    >
      <Routes>
        <Route path={ROUTES.AUTH_CALLBACK} element={<OpenIdConnectCallbackPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path={ROUTES.PREVIEW} element={<PreviewDefaultPage />} />
        <Route path={`${ROUTES.PREVIEW}/:branch`} element={<PreviewHomePage />} />
        <Route path={`${ROUTES.PREVIEW}/:branch/:index`} element={<PreviewIndexPage />} />
        <Route path={`${ROUTES.PREVIEW}/:branch/:index/:id`} element={<PreviewDetailPage />} />
        <Route path={ROUTES.NOT_AUTHORIZED} element={<ErrorStatePage variant="not-authorized" />} />
        <Route path={ROUTES.NOT_FOUND} element={<ErrorStatePage variant="not-found" />} />
        <Route path={ROUTES.NOT_IMPLEMENTED} element={<ErrorStatePage variant="not-implemented" />} />
        <Route path={ROUTES.SERVER_ERROR} element={<ErrorStatePage variant="server-error" />} />
        <Route path="*" element={<ErrorStatePage variant="not-found" />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
