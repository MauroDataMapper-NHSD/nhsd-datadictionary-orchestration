import {
  AppShell,
  Box,
  Button,
  Burger,
  Container,
  Group,
  List,
  Paper,
  Select,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ui.module.scss';
import SignInDialog, { OpenIdConnectProvider } from './sign-in-dialog';
export interface NavItem {
  label: string;
  to: string;
  onlySignedIn?: boolean;
}

export interface AppLayoutProps {
  appTitle: string;
  version: string;
  links: NavItem[];
  signInHref?: string;
  onSignIn?: (username: string, password: string) => Promise<void>;
  onSignOut?: () => void;
  onOpenIdConnect?: (provider: OpenIdConnectProvider) => Promise<void>;
  openIdConnectProviders?: OpenIdConnectProvider[];
  children: ReactNode;
}

export function AppLayout({ appTitle, version, links, signInHref, onSignIn, onSignOut, onOpenIdConnect, openIdConnectProviders = [], children }: AppLayoutProps): JSX.Element {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInDialogOpened, setSignInDialogOpened] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const hasSession =
      !!localStorage.getItem('token') ||
      !!localStorage.getItem('userId') ||
      !!localStorage.getItem('userName');
    setIsSignedIn(hasSession);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('role');
    localStorage.removeItem('needsToResetPassword');
    setIsSignedIn(false);
    if (onSignOut) {
      onSignOut();
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      setIsSigningIn(true);
      setSignInError('');

      if (onSignIn) {
        await onSignIn(username, password);
        setIsSignedIn(true);
        setSignInDialogOpened(false);
      } else if (signInHref) {
        // Fallback to redirect if no callback provided
        window.location.href = signInHref;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid username or password!';
      setSignInError(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleOpenSignInDialog = () => {
    if (onSignIn) {
      setSignInDialogOpened(true);
    } else if (signInHref) {
      window.location.href = signInHref;
    }
  };

  const handleOpenIdConnect = async (provider: OpenIdConnectProvider) => {
    if (onOpenIdConnect) {
      await onOpenIdConnect(provider);
    }
  };

  return (
    <>
      <AppShell header={{ height: 96 }} navbar={{ width: 320, breakpoint: 'md', collapsed: { mobile: !opened } }} padding="md">
        <AppShell.Header className={styles.header}>
          <Container size="lg" className={styles.headerContainer}>
            <Group justify="space-between" h="100%">
              <Group>
                <img className={styles.logo} src="/images/mdm-logo.png" alt="Mauro Data Mapper logo" />
                <Text className={styles.brand}>Data Dictionary Orchestrator</Text>
              </Group>
              <Group visibleFrom="md" className={styles.links}>
                {links
                  .filter((link) => !link.onlySignedIn || isSignedIn)
                  .map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
                    >
                      {link.label}
                    </NavLink>
                  ))}
              </Group>
              {isSignedIn ? (
                <Button variant="subtle" color="red" onClick={handleSignOut} visibleFrom="md">
                  Sign out
                </Button>
              ) : (
                <Button onClick={handleOpenSignInDialog} variant="outline" visibleFrom="md">
                  Sign in
                </Button>
              )}
              <Burger opened={opened} onClick={toggle} hiddenFrom="md" aria-label="Toggle navigation" />
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack>
            {links
              .filter((link) => !link.onlySignedIn || isSignedIn)
              .map((link) => (
                <UnstyledButton key={link.to} onClick={close}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? styles.mobileLinkActive : styles.mobileLink
                    }
                  >
                    {link.label}
                  </NavLink>
                </UnstyledButton>
              ))}
            {isSignedIn ? (
              <Button variant="subtle" color="red" onClick={handleSignOut}>
                Sign out
              </Button>
            ) : (
              <Button onClick={handleOpenSignInDialog} variant="outline">
                Sign in
              </Button>
            )}
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main className={styles.main}>
          <section className={styles.subheading}>
            <Container size="lg">
              <h1>{appTitle}</h1>
            </Container>
          </section>
          <Container size="lg" className="container">
            {children}
          </Container>
          <Box component="footer" className={styles.footer}>
            <Container size="lg" className={styles.footerContainer}>
              <Text size="sm">Powered by Mauro Data Mapper</Text>
              <Text size="sm">Version {version}</Text>
            </Container>
          </Box>
        </AppShell.Main>
      </AppShell>

      <SignInDialog
        opened={signInDialogOpened}
        onClose={() => setSignInDialogOpened(false)}
        onSignIn={handleSignIn}
        onOpenIdConnect={handleOpenIdConnect}
        providers={openIdConnectProviders}
        isLoading={isSigningIn}
        error={signInError}
      />
    </>
  );
}

export interface FeaturePageProps {
  title: string;
  description: string;
}

export function FeaturePage({ title, description }: FeaturePageProps): JSX.Element {
  return (
    <Box className={styles.featureCard}>
      <h2>{title}</h2>
      <p>{description}</p>
    </Box>
  );
}

export interface BranchPickerOption {
  value: string;
  label: string;
}

export interface BranchPickerProps {
  value?: string | null;
  options: BranchPickerOption[];
  onChange: (value: string | null) => void;
}

export function BranchPicker({ value = null, options, onChange }: BranchPickerProps): JSX.Element {
  return (
    <Select
      label="Current branch"
      placeholder="Select a branch"
      value={value}
      data={options}
      onChange={onChange}
    />
  );
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function PreviewBreadcrumb({ items }: { items: BreadcrumbItem[] }): JSX.Element {
  return (
    <Group gap="xs" className={styles.breadcrumb}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Group gap="xs" key={`${item.label}-${index}`}>
            {isLast || !item.to ? (
              <Text size="sm">{item.label}</Text>
            ) : (
              <NavLink to={item.to} className={styles.breadcrumbLink}>
                {item.label}
              </NavLink>
            )}
            {!isLast && <Text size="sm" c="dimmed">/</Text>}
          </Group>
        );
      })}
    </Group>
  );
}

export interface TocLink {
  label: string;
  anchor: string;
}

export interface PreviewTocProps {
  links: TocLink[];
  onNavigate: (anchor: string) => void;
}

export function PreviewToc({ links, onNavigate }: PreviewTocProps): JSX.Element | null {
  if (links.length === 0) {
    return null;
  }

  return (
    <Paper withBorder p="sm" className={styles.toc}>
      <Text fw={600} mb="xs">On this page</Text>
      <List spacing="xs" size="sm">
        {links.map((link) => (
          <List.Item key={link.anchor}>
            <UnstyledButton className={styles.tocLink} onClick={() => onNavigate(link.anchor)}>
              {link.label}
            </UnstyledButton>
          </List.Item>
        ))}
      </List>
    </Paper>
  );
}
