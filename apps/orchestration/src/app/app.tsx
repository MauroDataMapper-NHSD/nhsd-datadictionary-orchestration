import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppLayout, NavItem } from 'ui';
import { OrchestrationApiClient, PublicOpenIdConnectProvider } from 'api-client';
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
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    clearUserSession();

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
      navigate('/branches', { replace: true });
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

  return (
    <AppLayout
      appTitle="Data Dictionary Orchestrator"
      version={appVersion}
      links={navLinks}
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
