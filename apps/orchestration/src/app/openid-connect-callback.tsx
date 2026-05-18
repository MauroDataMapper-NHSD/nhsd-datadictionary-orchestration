import { Alert, Loader, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrchestrationApiClient } from 'api-client';
import { getOpenIdConnectRedirectUri, persistUserSession } from './auth';

const api = createOrchestrationApiClient(import.meta.env.VITE_MAURO_BASE_URL ?? 'http://localhost:8080');

function getCallbackParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return {
	code: searchParams.get('code') ?? '',
	state: searchParams.get('state') ?? '',
	sessionState: searchParams.get('session_state') ?? searchParams.get('sessionState') ?? '',
	providerId: localStorage.getItem('openIdConnectProviderId') ?? ''
  };
}

export function OpenIdConnectCallbackPage(): JSX.Element {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing OpenID Connect sign in...');
  const [error, setError] = useState('');

  useEffect(() => {
	const { code, state, sessionState, providerId } = getCallbackParams();

	if (!providerId || !code || !state) {
	  setError('Missing OpenID Connect callback parameters. Please try signing in again.');
	  return;
	}

	void (async () => {
	  try {
		setMessage('Signing you in...');
		const user = await api.signIn({
		  openidConnectProviderId: providerId,
		  state,
		  sessionState,
		  code,
		  redirectUrl: getOpenIdConnectRedirectUri()
		});
		persistUserSession(user);
		navigate('/branches', { replace: true });
	  } catch (err) {
		setError(err instanceof Error ? err.message : 'Unable to complete sign in.');
	  }
	})();
  }, [navigate]);

  return (
	<Stack align="center" justify="center" py="xl">
	  <Title order={2}>Sign in</Title>
	  {error ? <Alert color="red">{error}</Alert> : <Loader />}
	  <Text c="dimmed" ta="center">
		{error || message}
	  </Text>
	</Stack>
  );
}

export default OpenIdConnectCallbackPage;


