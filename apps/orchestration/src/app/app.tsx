import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppLayout, NavItem, PublishMenuAction } from 'ui';
import { OrchestrationApiClient, PublicOpenIdConnectProvider } from 'api-client';
import { notifications } from '@mantine/notifications';
import { saveAs } from 'file-saver';
import { clearUserSession, getOpenIdConnectRedirectUri, persistUserSession } from './auth';
import { OpenIdConnectCallbackPage } from './openid-connect-callback';
import {
  AboutPage,
  BranchDetailPage,
  BranchesPage,
  ChangesPage,
  ErrorStatePage,
  HomePage,
  PreviewDefaultPage,
  PreviewDetailPage,
  PreviewHomePage,
  PreviewIndexPage
} from './features';

const navLinks: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Branches', to: '/branches', onlySignedIn: true },
  { label: 'Preview', to: '/preview', onlySignedIn: true },
  { label: 'Changes', to: '/changes', onlySignedIn: true },
  { label: 'About', to: '/about' }
];

const appVersion = import.meta.env.VITE_APP_VERSION ?? '1.0.0';
const mauroBaseUrl = import.meta.env.VITE_MAURO_BASE_URL ?? 'http://localhost:8080';

const apiClient = new OrchestrationApiClient({ baseUrl: mauroBaseUrl });

export function App(): JSX.Element {
  const [openIdConnectProviders, setOpenIdConnectProviders] = useState<PublicOpenIdConnectProvider[]>([]);
  const [branches, setBranches] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(() => localStorage.getItem('selectedBranchId'));
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
    localStorage.removeItem('selectedBranchId');
    setSelectedBranchId(null);

    try {
      await apiClient.signOut();
    } catch (err) {
      console.error('Failed to sign out cleanly:', err);
    }

    navigate('/', { replace: true });
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      const result = await apiClient.signIn({ username, password });
      persistUserSession(result);
      navigate('/branches', { replace: true, state: { showInitialBranchPicker: true } });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid username or password!';
      throw new Error(errorMessage);
    }
  };

  const handleOpenIdConnect = async (provider: PublicOpenIdConnectProvider) => {
    if (!provider.authorizationEndpoint) {
      throw new Error(`Unable to authenticate with ${provider.label} because of a missing endpoint.`);
    }

    localStorage.setItem('openIdConnectProviderId', provider.id);

    const redirectUrl = getOpenIdConnectRedirectUri();
    const authUrl = new URL(provider.authorizationEndpoint);
    authUrl.searchParams.set('redirect_uri', redirectUrl);

    window.location.href = authUrl.toString();
  };

  useEffect(() => {
    const pathBranchMatch = location.pathname.match(/^\/(branches|preview|changes)\/([^/]+)/);
    const branchIdFromPath = pathBranchMatch?.[2] ?? null;

    if (branchIdFromPath) {
      setSelectedBranchId(branchIdFromPath);
      localStorage.setItem('selectedBranchId', branchIdFromPath);
    }
  }, [location.pathname]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    localStorage.setItem('selectedBranchId', branchId);

    if (location.pathname.startsWith('/preview')) {
      navigate(`/preview/${branchId}`);
      return;
    }

    if (location.pathname.startsWith('/changes')) {
      navigate(`/changes/${branchId}`);
      return;
    }

    navigate(`/branches/${branchId}/statistics`);
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

  const handleGeneratePublish = async (branchId: string, action: PublishMenuAction) => {
    const branchLabel = branches.find((branch) => branch.id === branchId)?.label ?? branchId;

    try {
      if (action === 'codeSystems') {
        const artifact = await apiClient.generateCodeSystems(branchId);
        saveAs(artifact.blob, artifact.filename);
        notifications.show({
          color: 'green',
          title: 'CodeSystems generated',
          message: `CodeSystems generated successfully for branch "${branchLabel}".`
        });
        return;
      }

      if (action === 'valueSets') {
        const artifact = await apiClient.generateValueSets(branchId);
        saveAs(artifact.blob, artifact.filename);
        notifications.show({
          color: 'green',
          title: 'ValueSets generated',
          message: `ValueSets generated successfully for branch "${branchLabel}".`
        });
        return;
      }

      if (action === 'changePaper') {
        const artifact = await apiClient.generateChangePaper(branchId, false);
        saveAs(artifact.blob, artifact.filename);
        notifications.show({
          color: 'green',
          title: 'Change paper generated',
          message: `Change paper generated successfully for branch "${branchLabel}".`
        });
        return;
      }

      if (action === 'changePaperWithDataSet') {
        const artifact = await apiClient.generateChangePaper(branchId, true);
        saveAs(artifact.blob, artifact.filename);
        notifications.show({
          color: 'green',
          title: 'Change paper generated',
          message: `Change paper (with Data Set definitions) generated successfully for branch "${branchLabel}".`
        });
        return;
      }

      const artifact = await apiClient.generateWebsite(branchId);
      saveAs(artifact.blob, artifact.filename);
      notifications.show({
        color: 'green',
        title: 'Website generated',
        message: `Website generated successfully for branch "${branchLabel}".`
      });
    } catch {
      notifications.show({
        color: 'red',
        title: 'Generation failed',
        message: `Could not complete publish action for branch "${branchLabel}".`
      });
      throw new Error('Publish action failed');
    }
  };

  const showInitialBranchPicker =
    location.pathname === '/branches' &&
    ((location.state as { showInitialBranchPicker?: boolean } | null)?.showInitialBranchPicker === true);

  return (
    <AppLayout
      appTitle="Data Dictionary Orchestrator"
      version={appVersion}
      links={navLinks}
      branchOptions={branches.map((branch) => ({ value: branch.id, label: branch.label }))}
      selectedBranchId={selectedBranchId}
      onBranchChange={handleBranchChange}
      onLoadStatistics={handleLoadStatistics}
      onLoadIntegrityChecks={handleLoadIntegrityChecks}
      onGeneratePublish={handleGeneratePublish}
      hideBranchSelector={showInitialBranchPicker}
      signInHref={mauroBaseUrl}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
      onOpenIdConnect={handleOpenIdConnect}
      openIdConnectProviders={openIdConnectProviders}
    >
      <Routes>
        <Route path="/auth/openid-connect/callback" element={<OpenIdConnectCallbackPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/branches/:branch/:tabView" element={<BranchDetailPage />} />
        <Route path="/preview" element={<PreviewDefaultPage />} />
        <Route path="/preview/:branch" element={<PreviewHomePage />} />
        <Route path="/preview/:branch/:index" element={<PreviewIndexPage />} />
        <Route path="/preview/:branch/:index/:id" element={<PreviewDetailPage />} />
        <Route path="/changes" element={<ChangesPage />} />
        <Route path="/changes/:branch" element={<ChangesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/not-authorized" element={<ErrorStatePage variant="not-authorized" />} />
        <Route path="/not-found" element={<ErrorStatePage variant="not-found" />} />
        <Route path="/not-implemented" element={<ErrorStatePage variant="not-implemented" />} />
        <Route path="/server-error" element={<ErrorStatePage variant="server-error" />} />
        <Route path="*" element={<ErrorStatePage variant="not-found" />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
