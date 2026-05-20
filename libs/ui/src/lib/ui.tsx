import {
  AppShell,
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  ThemeIcon,
  Text
} from '@mantine/core';
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
  branchOptions?: BranchPickerOption[];
  selectedBranchId?: string | null;
  onBranchChange?: (branchId: string) => void;
  hideBranchSelector?: boolean;
  onLoadStatistics?: (branchId: string) => Promise<StatisticsMenuRow[]>;
  onLoadIntegrityChecks?: (branchId: string) => Promise<IntegrityCheckMenuCheck[]>;
  mauroBaseUrl?: string;
  signInHref?: string;
  onSignIn?: (username: string, password: string) => Promise<void>;
  onSignOut?: () => void;
  onOpenIdConnect?: (provider: OpenIdConnectProvider) => Promise<void>;
  openIdConnectProviders?: OpenIdConnectProvider[];
  children: ReactNode;
}

export interface StatisticsMenuRow {
  name: string;
  preparatory: number;
  retired: number;
  total: number;
}

export interface IntegrityCheckMenuComponent {
  id: string;
  label: string;
  domainType?: string;
  modelId?: string;
  parentId?: string;
}

export interface IntegrityCheckMenuIssue {
  component?: IntegrityCheckMenuComponent;
  details?: string[];
}

export interface IntegrityCheckMenuCheck {
  checkName: string;
  description: string;
  errors: IntegrityCheckMenuIssue[];
}

export function AppLayout({ appTitle, version, links, branchOptions = [], selectedBranchId = null, onBranchChange, hideBranchSelector = false, onLoadStatistics, onLoadIntegrityChecks, mauroBaseUrl = '', signInHref, onSignIn, onSignOut, onOpenIdConnect, openIdConnectProviders = [], children }: AppLayoutProps): JSX.Element {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInDialogOpened, setSignInDialogOpened] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [statisticsOpened, setStatisticsOpened] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [statisticsError, setStatisticsError] = useState<string | null>(null);
  const [statisticsRows, setStatisticsRows] = useState<StatisticsMenuRow[]>([]);
  const [integrityOpened, setIntegrityOpened] = useState(false);
  const [integrityLoading, setIntegrityLoading] = useState(false);
  const [integrityError, setIntegrityError] = useState<string | null>(null);
  const [integrityRows, setIntegrityRows] = useState<IntegrityCheckMenuCheck[]>([]);
  const [selectedIntegrityCheck, setSelectedIntegrityCheck] = useState<IntegrityCheckMenuCheck | null>(null);

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

  const showBranchSelector = isSignedIn && !hideBranchSelector && branchOptions.length > 0 && !!onBranchChange;
  const headerHeight = showBranchSelector ? 228 : 140;

  const openStatistics = async () => {
    if (!selectedBranchId || !onLoadStatistics) {
      return;
    }

    setStatisticsOpened(true);
    setStatisticsLoading(true);
    setStatisticsError(null);

    try {
      const rows = await onLoadStatistics(selectedBranchId);
      setStatisticsRows(rows);
    } catch {
      setStatisticsRows([]);
      setStatisticsError('Could not load branch statistics.');
    } finally {
      setStatisticsLoading(false);
    }
  };

  const openIntegrityChecks = async () => {
    if (!selectedBranchId || !onLoadIntegrityChecks) {
      return;
    }

    setIntegrityOpened(true);
    setIntegrityLoading(true);
    setIntegrityError(null);

    try {
      const rows = await onLoadIntegrityChecks(selectedBranchId);
      setIntegrityRows(rows);
      setSelectedIntegrityCheck(rows[0] ?? null);
    } catch {
      setIntegrityRows([]);
      setSelectedIntegrityCheck(null);
      setIntegrityError('Could not load integrity checks.');
    } finally {
      setIntegrityLoading(false);
    }
  };

  const getMauroComponentUrl = (component: IntegrityCheckMenuComponent): string => {
    const { domainType = '', modelId = '', parentId = '', id } = component;
    const domainTypePatterns: Record<string, string> = {
      Folder: `/folder/${id}`,
      DataModel: `/dataModel/${id}`,
      ReferenceDataModel: `/referenceDataModel/${id}`,
      Terminology: `/terminology/${id}`,
      DataClass: `/dataClass/${modelId}/${parentId}/${id}`,
      DataElement: `/dataElement/${modelId}/${parentId}/${id}`,
      Classification: `/classification/${id}`,
      EnumerationType: `/enumerationType/${modelId}/${parentId}/${id}`,
      Term: `/term/${modelId}/${id}`,
      CodeSet: `/codeSet/${id}`
    };
    const path = domainTypePatterns[domainType];
    return path ? `${mauroBaseUrl}/#/catalogue${path}` : mauroBaseUrl;
  };

  return (
    <>
      <AppShell header={{ height: headerHeight }} padding="md">
        <AppShell.Header className={styles.header}>
          <Group justify="space-between" className={styles.headerContent}>
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
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleSignOut}
                  visibleFrom="md"
                  className={styles.signOutButton}
                >
                  Sign out
                </Button>
              ) : (
                <Button onClick={handleOpenSignInDialog} variant="outline" visibleFrom="md">
                  Sign in
                </Button>
              )}
            </Group>
          {showBranchSelector && (
            <div className={styles.branchSelectorBar}>
              <Container size="xl" className={styles.branchSelectorBarContent}>
                <Group align="flex-end" justify="space-between" wrap="nowrap" gap="md">
                  <Group align="flex-end" gap="sm" className={styles.branchSelectorGroup} wrap="nowrap">
                    <Text className={styles.branchSelectorLabel}>Current branch</Text>
                    <Box className={styles.branchSelectorInput}>
                      <BranchPicker
                        value={selectedBranchId}
                        label=""
                        size="md"
                        options={branchOptions}
                        onChange={(value) => value && onBranchChange(value)}
                      />
                    </Box>
                  </Group>
                  <Box className={styles.menuSelector}>
                    <Menu shadow="md" width={180} position="bottom-end">
                      <Menu.Target>
                        <Button
                          className={styles.menuButton}
                          variant="outline"
                          color="dark"
                          disabled={!selectedBranchId || (!onLoadStatistics && !onLoadIntegrityChecks)}
                        >
                          Menu
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Label>Application</Menu.Label>
                        <Menu.Item disabled={!onLoadStatistics} onClick={() => void openStatistics()}>Statistics</Menu.Item>
                        <Menu.Item disabled={!onLoadIntegrityChecks} onClick={() => void openIntegrityChecks()}>Integrity checks</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Box>
                </Group>
              </Container>
            </div>
          )}
        </AppShell.Header>

        <AppShell.Main className={styles.main} style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}>
          <Container size="lg" className={`container ${styles.contentContainer}`}>
            {children}
          </Container>
          <Box component="footer" className={styles.footer}>
            <Container size="lg" className={styles.footerContainer}>
              <Text>Powered by Mauro Data Mapper</Text>
              <Text>Version {version}</Text>
            </Container>
          </Box>
        </AppShell.Main>
      </AppShell>

      <Modal opened={statisticsOpened} onClose={() => setStatisticsOpened(false)} title="Statistics" size="xl" centered>
        {statisticsLoading && <Loader />}
        {!statisticsLoading && statisticsError && <Alert color="red">{statisticsError}</Alert>}
        {!statisticsLoading && !statisticsError && statisticsRows.length === 0 && (
          <Text>No statistics available for this branch.</Text>
        )}
        {!statisticsLoading && !statisticsError && statisticsRows.length > 0 && (
          <Table className={styles.statisticsTable}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Preparatory</Table.Th>
                <Table.Th>Retired</Table.Th>
                <Table.Th>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {statisticsRows.map((row) => (
                <Table.Tr key={row.name}>
                  <Table.Td><strong>{row.name}</strong></Table.Td>
                  <Table.Td>{row.preparatory}</Table.Td>
                  <Table.Td>{row.retired}</Table.Td>
                  <Table.Td>{row.total}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Modal>

      <Modal opened={integrityOpened} onClose={() => setIntegrityOpened(false)} title="Integrity checks" size="xl" centered>
        {integrityLoading && <Loader />}
        {!integrityLoading && integrityError && <Alert color="red">{integrityError}</Alert>}
        {!integrityLoading && !integrityError && integrityRows.length === 0 && (
          <Text>No integrity checks available for this branch.</Text>
        )}
        {!integrityLoading && !integrityError && integrityRows.length > 0 && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <ScrollArea mah={420}>
                <Stack gap="xs">
                  {integrityRows.map((check) => {
                    const hasErrors = (check.errors?.length ?? 0) > 0;
                    const isSelected = selectedIntegrityCheck?.checkName === check.checkName;

                    return (
                      <button
                        key={check.checkName}
                        type="button"
                        className={styles.integrityListItem}
                        data-selected={isSelected}
                        onClick={() => setSelectedIntegrityCheck(check)}
                      >
                        <Group gap="xs" wrap="nowrap">
                          <ThemeIcon color={hasErrors ? 'red' : 'green'} variant="light" size="sm" style={{ flexShrink: 0 }}>
                            {hasErrors ? '!' : '✓'}
                          </ThemeIcon>
                          <Text size="sm" fw={isSelected ? 700 : 400} style={{ flex: 1 }}>
                            {check.checkName}
                          </Text>
                          {hasErrors && (
                            <Badge color="red" size="sm" style={{ flexShrink: 0 }}>
                              {check.errors.length}
                            </Badge>
                          )}
                        </Group>
                      </button>
                    );
                  })}
                </Stack>
              </ScrollArea>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              {!selectedIntegrityCheck && (
                <Text size="sm" c="dimmed" fs="italic">Select a category to view further details.</Text>
              )}
              {selectedIntegrityCheck && (
                <Paper withBorder p="sm">
                  <Group justify="space-between" align="center">
                    <Text fw={700}>{selectedIntegrityCheck.checkName}</Text>
                    <Button variant="light" size="xs" onClick={() => void openIntegrityChecks()}>
                      Run
                    </Button>
                  </Group>
                  <Text size="sm" mt="xs">{selectedIntegrityCheck.description}</Text>
                  <Divider my="sm" />
                  {(selectedIntegrityCheck.errors?.length ?? 0) === 0 ? (
                    <Group gap="xs">
                      <ThemeIcon color="green" variant="light" size="sm">✓</ThemeIcon>
                      <Text size="sm" c="green">No issues found</Text>
                    </Group>
                  ) : (
                    <Stack gap="xs">
                      <Group gap="xs">
                        <ThemeIcon color="red" variant="light" size="sm">!</ThemeIcon>
                        <Text size="sm" c="red">{selectedIntegrityCheck.errors.length} issue(s) found</Text>
                      </Group>
                      <ScrollArea mah={310}>
                        <Stack gap="xs">
                          {selectedIntegrityCheck.errors.map((error, index) => (
                            <Paper key={`${selectedIntegrityCheck.checkName}-${index}`} withBorder p="xs">
                              {error.component?.domainType && (
                                <Text size="xs" c="dimmed" mb={2}>{error.component.domainType}</Text>
                              )}
                              {error.component ? (
                                <a href={getMauroComponentUrl(error.component)} target="_blank" rel="noreferrer" className={styles.integrityComponentLink}>
                                  {error.component.label}
                                </a>
                              ) : null}
                              {error.details?.map((detail, detailIndex) => (
                                <Text key={detailIndex} size="xs" c="dimmed" mt={2}>{detail}</Text>
                              ))}
                            </Paper>
                          ))}
                        </Stack>
                      </ScrollArea>
                    </Stack>
                  )}
                </Paper>
              )}
            </Grid.Col>
          </Grid>
        )}
      </Modal>

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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
}

export function BranchPicker({ value = null, options, onChange, size = 'sm', label = 'Current branch' }: BranchPickerProps): JSX.Element {
  return (
    <Select
      {...(label ? { label } : {})}
      placeholder="Select a branch"
      value={value}
      data={options}
      onChange={onChange}
      size={size}
    />
  );
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function PreviewBreadcrumb({ items }: { items: BreadcrumbItem[] }): JSX.Element {
  return (
    <ul className="mdm-preview-breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li key={`${item.label}-${index}`}>
            {isLast || !item.to ? (
              <span>{item.label}</span>
            ) : (
              <NavLink to={item.to}>{item.label}</NavLink>
            )}
          </li>
        );
      })}
    </ul>
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
    <div className="mdm-preview-toc">
      <div className="mdm-preview-toc__label">On this page</div>
      <ul>
        {links.map((link) => (
          <li key={link.anchor}>
            <button type="button" className="mdm-preview-toc__link" onClick={() => onNavigate(link.anchor)}>
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

