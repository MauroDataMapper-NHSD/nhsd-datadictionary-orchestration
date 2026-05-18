import {
  Modal,
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Box,
  Divider,
  Text,
  Alert,
  Loader,
  Image
} from '@mantine/core';
import { useState, useEffect } from 'react';

export interface OpenIdConnectProvider {
  id: string;
  label: string;
  imageUrl?: string;
  authorizationEndpoint?: string;
}

export interface SignInDialogProps {
  opened: boolean;
  onClose: () => void;
  onSignIn: (username: string, password: string) => Promise<void>;
  onOpenIdConnect?: (provider: OpenIdConnectProvider) => Promise<void>;
  providers?: OpenIdConnectProvider[];
  isLoading?: boolean;
  error?: string;
}

export function SignInDialog({
  opened,
  onClose,
  onSignIn,
  onOpenIdConnect,
  providers = [],
  isLoading = false,
  error: initialError = ''
}: SignInDialogProps): JSX.Element {
  const [error, setError] = useState<string>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  const validateForm = () => {
    const nextEmailError = !email
      ? 'Email is required'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Invalid email address'
        : null;
    const nextPasswordError = !password ? 'Password is required' : null;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    return !nextEmailError && !nextPasswordError;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSignIn(email, password);
      setEmail('');
      setPassword('');
      setEmailError(null);
      setPasswordError(null);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to sign in. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenIdConnect = async (provider: OpenIdConnectProvider) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (onOpenIdConnect) {
        await onOpenIdConnect(provider);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Unable to authenticate with ${provider.label}`;
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Sign in"
      centered
      size="md"
      closeButtonProps={{ 'aria-label': 'Close modal' }}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed" ta="center">
          Please sign in to continue using Mauro
        </Text>

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSignIn();
          }}
        >
          <Stack gap="sm">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              disabled={isSubmitting}
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              onBlur={() => setEmailError(!email ? 'Email is required' : null)}
              error={emailError}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              disabled={isSubmitting}
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              onBlur={() => setPasswordError(!password ? 'Password is required' : null)}
              error={passwordError}
            />

            {error && (
              <Alert color="red" title="Sign in failed">
                {error}
              </Alert>
            )}

            <Button type="submit" fullWidth disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <Loader size="xs" /> : 'Sign in'}
            </Button>
          </Stack>
        </Box>

        {providers.length > 0 && (
          <>
            <Divider label="or" labelPosition="center" />
            <Stack gap="xs">
              {providers.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  onClick={() => handleOpenIdConnect(provider)}
                  disabled={isSubmitting || isLoading}
                  leftSection={
                    provider.imageUrl ? (
                          <Image src={provider.imageUrl} alt={provider.label} w={20} h={20} />
                    ) : null
                  }
                >
                  Sign in with {provider.label}
                </Button>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Modal>
  );
}

export default SignInDialog;





