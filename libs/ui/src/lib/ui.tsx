import {
  AppShell,
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Kbd,
  Loader,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  ThemeIcon,
  Title,
  Text
} from '@mantine/core';
import { IconCircleCheck, IconGitBranch } from '@tabler/icons-react';
import type { ComboboxItem, ComboboxItemGroup } from '@mantine/core';
import type { ReactElement, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './ui.module.scss';
import SignInDialog, { OpenIdConnectProvider } from './sign-in-dialog';
import { FindDialog, FindDialogItem, FindSearchPage, FindSearchRequest } from './find-dialog';

export type { OpenIdConnectProvider } from './sign-in-dialog';
export type { FindDialogItem, FindSearchPage, FindSearchRequest } from './find-dialog';
export interface NavItem {
  label: string;
  to: string;
  onlySignedIn?: boolean;
}

export interface PageOption {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface AppLayoutProps {
  appTitle: string;
  version: string;
  links: NavItem[];
  pageOptions?: PageOption[];
  pageOptionsLabel?: string;
  branchOptions?: BranchPickerOption[];
  selectedBranchId?: string | null;
  onBranchChange?: (branchId: string) => void;
  onLoadStatistics?: (branchId: string) => Promise<StatisticsMenuRow[]>;
  onLoadIntegrityChecks?: (branchId: string) => Promise<IntegrityCheckMenuCheck[]>;
  onRunChangePaperPreview?: (branchId: string, includeDataSets: boolean) => Promise<ChangePaperPreviewData>;
  onGeneratePublish?: (branchId: string, action: PublishMenuAction) => Promise<void>;
  onLoadAbout?: () => Promise<AboutData>;
  mauroBaseUrl?: string;
  signInHref?: string;
  onSignIn?: (username: string, password: string) => Promise<void>;
  onSignOut?: () => void;
  onOpenIdConnect?: (provider: OpenIdConnectProvider) => Promise<void>;
  openIdConnectProviders?: OpenIdConnectProvider[];
  onFindSelect?: (item: FindDialogItem) => void;
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

export type PublishMenuAction =
  | 'codeSystems'
  | 'valueSets'
  | 'changePaper'
  | 'changePaperWithDataSet'
  | 'website';

export interface ChangePaperPreviewItem {
  name: string;
  summary: string;
  detail: string;
}

export interface ChangePaperPreviewStereotype {
  name: string;
  changes: ChangePaperPreviewItem[];
}

export interface ChangePaperPreviewData {
  background?: Record<string, string | undefined>;
  stereotypes: ChangePaperPreviewStereotype[];
}

export interface AboutData {
  mauroVersion: string;
  pluginVersion: string;
}

export function AppLayout({ appTitle, version, links, pageOptions = [], pageOptionsLabel = 'Page options...', branchOptions = [], selectedBranchId = null,
                            onBranchChange, onLoadStatistics,
                            onLoadIntegrityChecks, onRunChangePaperPreview, onGeneratePublish,
                            onLoadAbout, mauroBaseUrl = '', signInHref,
                            onSignIn, onSignOut, onOpenIdConnect, openIdConnectProviders = [],
                            onFindSelect, children }
                          : AppLayoutProps): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [publishActionRunning, setPublishActionRunning] = useState<PublishMenuAction | null>(null);
  const [changePaperOpened, setChangePaperOpened] = useState(false);
  const [changePaperLoading, setChangePaperLoading] = useState(false);
  const [changePaperError, setChangePaperError] = useState<string | null>(null);
  const [changePaperData, setChangePaperData] = useState<ChangePaperPreviewData | null>(null);
  const [changePaperTitle, setChangePaperTitle] = useState('Change Paper Preview');
  const [aboutOpened, setAboutOpened] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [findOpened, setFindOpened] = useState(false);

  const findShortcutLabel = useMemo(
    () =>
      typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
        ? 'Cmd+Shift+F'
        : 'Ctrl+Shift+F',
    []
  );

  useEffect(() => {
    const hasSession =
      !!localStorage.getItem('token') ||
      !!localStorage.getItem('userId') ||
      !!localStorage.getItem('userName');
    setIsSignedIn(hasSession);
  }, [location.key]);

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

  const findSearch = async ({ prefix, offset, max }: FindSearchRequest): Promise<FindSearchPage> => {
    if (!selectedBranchId || !mauroBaseUrl) {
      return { count: 0, items: [] };
    }

    const url = new URL(
      `${mauroBaseUrl}/api/nhsdd/${encodeURIComponent(selectedBranchId)}/allItems`
    );
    url.searchParams.set('max', String(max));
    url.searchParams.set('offset', String(offset));

    if (prefix && prefix.trim().length > 0) {
      url.searchParams.set('prefix', prefix.trim());
    }

    const response = await fetch(url.toString(), { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    const data: unknown = await response.json();

    if (data && typeof data === 'object' && 'body' in data) {
      const wrapped = data as { body?: FindSearchPage };
      return wrapped.body ?? { count: 0, items: [] };
    }

    return data as FindSearchPage;
  };

  const showBranchSelector = isSignedIn && branchOptions.length > 0 && !!onBranchChange;
  const showPageOptions = showBranchSelector && pageOptions.length > 0;
  const headerHeight = showBranchSelector ? 160 : 80;

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

  const runPublishAction = async (action: PublishMenuAction) => {
    if (!selectedBranchId || !onGeneratePublish) {
      return;
    }

    setPublishActionRunning(action);
    try {
      await onGeneratePublish(selectedBranchId, action);
    } finally {
      setPublishActionRunning(null);
    }
  };

  const openChangePaperPreview = async (includeDataSets: boolean) => {
    if (!selectedBranchId || !onRunChangePaperPreview) { return; }

    setChangePaperTitle(
      includeDataSets ? 'Change Paper Preview (with Data Set Definitions)' : 'Change Paper Preview'
    );
    setChangePaperOpened(true);
    setChangePaperLoading(true);
    setChangePaperError(null);
    setChangePaperData(null);

    try {
      const data = await onRunChangePaperPreview(selectedBranchId, includeDataSets);
      setChangePaperData(data);
    } catch {
      setChangePaperError('Could not load the change paper preview. Please try again.');
    } finally {
      setChangePaperLoading(false);
    }
  };

  const changePaperAnchorId = (stereotype: string, name: string) =>
    `cp-${stereotype}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const changePaperScrollTo = (anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const backgroundLabelMap: Record<string, string> = {
    reference: 'Reference',
    type: 'Type',
    versionNo: 'Version No.',
    subject: 'Subject',
    effectiveDate: 'Effective Date',
    reasonForChange: 'Reason for Change',
    publicationDate: 'Publication Date',
    background: 'Background',
    sponsor: 'Sponsor',
    contactDetails: 'Contact Details'
  };

  const openAbout = async () => {
    setAboutOpened(true);
    setAboutLoading(true);
    setAboutError(null);
    setAboutData(null);

    if (!onLoadAbout) {
      setAboutLoading(false);
      return;
    }

    try {
      const data = await onLoadAbout();
      setAboutData(data);
    } catch {
      setAboutError('Could not load version information.');
    } finally {
      setAboutLoading(false);
    }
  };

  const openFind = () => {
    setFindOpened(true);
  };

  const closeFind = () => {
    setFindOpened(false);
  };

  const selectFindResult = (item: FindDialogItem) => {
    onFindSelect?.(item);
    setFindOpened(false);

    if (selectedBranchId) {
      navigate(`/preview/${encodeURIComponent(selectedBranchId)}/${encodeURIComponent(item.stereotype)}/${encodeURIComponent(item.catalogueItemId)}`);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isFindShortcut =
        event.key.toLowerCase() === 'f' && event.shiftKey && (event.metaKey || event.ctrlKey);

      if (!isFindShortcut || !showBranchSelector) {
        return;
      }

      event.preventDefault();
      openFind();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showBranchSelector]);

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
      <AppShell header={{ height: headerHeight }} padding='md'>
        <AppShell.Header className={styles.header}>
          <Group justify='space-between' align='center' className={styles.headerContent}>
              <Group>
                <img className={styles.logo} src='/images/nhs-logo.png' alt='NHS logo' />
                <Text className={styles.brand}>Data Dictionary Orchestrator</Text>
              </Group>
              {isSignedIn ? (
                <Button
                  variant='filled'
                  color='red'
                  onClick={handleSignOut}
                  visibleFrom='md'
                  className={styles.signOutButton}
                >
                  Sign out
                </Button>
              ) : (
                <Button onClick={handleOpenSignInDialog} variant='outline' visibleFrom='md'>
                  Sign in
                </Button>
              )}
            </Group>
          {showBranchSelector && (
            <div className={styles.branchSelectorBar}>
              <Container size='xl' className={styles.branchSelectorBarContent}>
                <Group align='flex-end' justify='space-between' wrap='nowrap' gap='md'>
                  <Group align='flex-end' gap='sm' className={styles.branchControls} wrap='nowrap'>
                    <Group align='flex-end' gap='sm' className={styles.branchSelectorGroup} wrap='nowrap'>
                      <Text className={styles.branchSelectorLabel}>Current branch</Text>
                      <Box className={styles.branchSelectorInput}>
                        <BranchPicker
                          value={selectedBranchId}
                          label=''
                          size='md'
                          options={branchOptions}
                          onChange={(value) => value && onBranchChange(value)}
                        />
                      </Box>
                    </Group>

                    <Box className={styles.findSelector}>
                      <Button
                        className={styles.findButton}
                        variant='outline'
                        color='dark'
                        onClick={openFind}
                        rightSection={<Kbd size='xs'>{findShortcutLabel}</Kbd>}
                      >
                        Find
                      </Button>
                    </Box>

                    <Box className={styles.menuSelector}>
                      <Menu shadow='md' width={360} position='bottom-end'>
                        <Menu.Target>
                          <Button
                            className={styles.menuButton}
                            variant='outline'
                            color='dark'
                            disabled={!selectedBranchId || (!onLoadStatistics && !onLoadIntegrityChecks &&
                              !onRunChangePaperPreview && !onGeneratePublish)}
                          >
                            Branch options...
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>Overview</Menu.Label>
                          <Menu.Item disabled={!onLoadStatistics} onClick={() => void openStatistics()}>Statistics</Menu.Item>
                          <Menu.Item disabled={!onLoadIntegrityChecks} onClick={() => void openIntegrityChecks()}>Integrity checks</Menu.Item>
                          <Menu.Divider />
                          <Menu.Label>Preview Change Paper</Menu.Label>
                          <Menu.Item
                            disabled={!selectedBranchId || !onRunChangePaperPreview}
                            onClick={() => void openChangePaperPreview(false)}
                          >
                            Change Paper
                          </Menu.Item>
                          <Menu.Item
                            disabled={!selectedBranchId || !onRunChangePaperPreview}
                            onClick={() => void openChangePaperPreview(true)}
                          >
                            Change Paper (with Data Set Definitions)
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Label>Generate and Download</Menu.Label>
                          <Menu.Item
                            disabled={!selectedBranchId || !onGeneratePublish}
                            onClick={() => void runPublishAction('changePaper')}
                            rightSection={publishActionRunning === 'changePaper' ? <Loader size='xs' /> : undefined}
                          >
                            Change Paper
                          </Menu.Item>
                          <Menu.Item
                            disabled={!selectedBranchId || !onGeneratePublish}
                            onClick={() => void runPublishAction('changePaperWithDataSet')}
                            rightSection={publishActionRunning === 'changePaperWithDataSet' ? <Loader size='xs' /> : undefined}
                          >
                            Change Paper (with Data Set Definitions)
                          </Menu.Item>
                          <Menu.Item
                            disabled={!selectedBranchId || !onGeneratePublish}
                            onClick={() => void runPublishAction('codeSystems')}
                            rightSection={publishActionRunning === 'codeSystems' ? <Loader size='xs' /> : undefined}
                          >
                            CodeSystems
                          </Menu.Item>
                          <Menu.Item
                            disabled={!selectedBranchId || !onGeneratePublish}
                            onClick={() => void runPublishAction('valueSets')}
                            rightSection={publishActionRunning === 'valueSets' ? <Loader size='xs' /> : undefined}
                          >
                            ValueSets
                          </Menu.Item>
                          <Menu.Item
                            disabled={!selectedBranchId || !onGeneratePublish}
                            onClick={() => void runPublishAction('website')}
                            rightSection={publishActionRunning === 'website' ? <Loader size='xs' /> : undefined}
                          >
                            Website
                          </Menu.Item>
                          <Menu.Item disabled>
                            Data elements usage spreadsheet
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Label>Info</Menu.Label>
                          <Menu.Item onClick={() => void openAbout()}>About</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Box>
                  </Group>

                  {showPageOptions && (
                    <Box className={styles.menuSelector}>
                      <Menu shadow='md' width={360} position='bottom-end'>
                        <Menu.Target>
                          <Button className={styles.menuButton} variant='outline' color='dark'>
                            {pageOptionsLabel}
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          {pageOptions.map((option) => (
                            <Menu.Item key={option.label} disabled={option.disabled} onClick={option.onClick}>
                              {option.label}
                            </Menu.Item>
                          ))}
                        </Menu.Dropdown>
                      </Menu>
                    </Box>
                  )}
                </Group>
              </Container>
            </div>
          )}
        </AppShell.Header>

        <AppShell.Main className={styles.main} style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}>
          <Container size='lg' className={`container ${styles.contentContainer}`}>
            {children}
          </Container>
          <Box component='footer' className={styles.footer}>
            <Container fluid className={styles.footerContainer}>
              <Group gap='sm' className={styles.footerLeft}>
                <img className={styles.footerLogo} src='/images/mdm-logo.png' alt='Mauro Data Mapper logo' />
                <Text>Powered by Mauro Data Mapper</Text>
              </Group>
              <Text className={styles.footerVersion}>Version {version}</Text>
            </Container>
          </Box>
        </AppShell.Main>
      </AppShell>

      <Modal opened={statisticsOpened} onClose={() => setStatisticsOpened(false)} title='Statistics' size='xl' centered>
        {statisticsLoading && <Loader />}
        {!statisticsLoading && statisticsError && <Alert color='red'>{statisticsError}</Alert>}
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

      <Modal opened={integrityOpened} onClose={() => setIntegrityOpened(false)} title='Integrity checks' size='xl' centered>
        {integrityLoading && <Loader />}
        {!integrityLoading && integrityError && <Alert color='red'>{integrityError}</Alert>}
        {!integrityLoading && !integrityError && integrityRows.length === 0 && (
          <Text>No integrity checks available for this branch.</Text>
        )}
        {!integrityLoading && !integrityError && integrityRows.length > 0 && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <ScrollArea mah={420}>
                <Stack gap='xs'>
                  {integrityRows.map((check) => {
                    const hasErrors = (check.errors?.length ?? 0) > 0;
                    const isSelected = selectedIntegrityCheck?.checkName === check.checkName;

                    return (
                      <button
                        key={check.checkName}
                        type='button'
                        className={styles.integrityListItem}
                        data-selected={isSelected}
                        onClick={() => setSelectedIntegrityCheck(check)}
                      >
                        <Group gap='xs' wrap='nowrap'>
                          <ThemeIcon color={hasErrors ? 'red' : 'green'} variant='light' size='sm' style={{ flexShrink: 0 }}>
                            {hasErrors ? '!' : '✓'}
                          </ThemeIcon>
                          <Text size='sm' fw={isSelected ? 700 : 400} style={{ flex: 1 }}>
                            {check.checkName}
                          </Text>
                          {hasErrors && (
                            <Badge color='red' size='sm' style={{ flexShrink: 0 }}>
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
                <Text size='sm' c='dimmed' fs='italic'>Select a category to view further details.</Text>
              )}
              {selectedIntegrityCheck && (
                <Paper withBorder p='sm'>
                  <Group justify='space-between' align='center'>
                    <Text fw={700}>{selectedIntegrityCheck.checkName}</Text>
                    <Button variant='light' size='xs' onClick={() => void openIntegrityChecks()}>
                      Run
                    </Button>
                  </Group>
                  <Text size='sm' mt='xs'>{selectedIntegrityCheck.description}</Text>
                  <Divider my='sm' />
                  {(selectedIntegrityCheck.errors?.length ?? 0) === 0 ? (
                    <Group gap='xs'>
                      <ThemeIcon color='green' variant='light' size='sm'>✓</ThemeIcon>
                      <Text size='sm' c='green'>No issues found</Text>
                    </Group>
                  ) : (
                    <Stack gap='xs'>
                      <Group gap='xs'>
                        <ThemeIcon color='red' variant='light' size='sm'>!</ThemeIcon>
                        <Text size='sm' c='red'>{selectedIntegrityCheck.errors.length} issue(s) found</Text>
                      </Group>
                      <ScrollArea mah={310}>
                        <Stack gap='xs'>
                          {selectedIntegrityCheck.errors.map((error, index) => (
                            <Paper key={`${selectedIntegrityCheck.checkName}-${index}`} withBorder p='xs'>
                              {error.component?.domainType && (
                                <Text size='xs' c='dimmed' mb={2}>{error.component.domainType}</Text>
                              )}
                              {error.component ? (
                                <a href={getMauroComponentUrl(error.component)} target='_blank' rel='noreferrer'
                                   className={styles.integrityComponentLink}>
                                  {error.component.label}
                                </a>
                              ) : null}
                              {error.details?.map((detail, detailIndex) => (
                                <Text key={detailIndex} size='xs' c='dimmed' mt={2}>{detail}</Text>
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

      <Modal
        opened={changePaperOpened}
        onClose={() => setChangePaperOpened(false)}
        title={<Title order={3}>{changePaperTitle}</Title>}
        size='90%'
        styles={{
          content: { display: 'flex', flexDirection: 'column', maxHeight: '92vh' },
          body: { flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }
        }}
      >
        {changePaperLoading && (
          <Stack align='center' gap='md' py='xl'>
            <Loader size='lg' />
            <Text size='lg' fw={500}>Generating change paper preview…</Text>
            <Text size='sm' c='dimmed'>This may take a moment, please wait.</Text>
          </Stack>
        )}

        {!changePaperLoading && changePaperError && (
          <Alert color='red' title='Error loading preview' mt='md'>{changePaperError}</Alert>
        )}

        {!changePaperLoading && !changePaperError && changePaperData && (
          <Stack gap='xl'>
            <Alert color='blue' variant='light'>
              This is a <strong>preview</strong> only. Some content may not exactly match the final published change paper.
            </Alert>

            {changePaperData.background && Object.keys(changePaperData.background).length > 0 && (
              <Box>
                <Title order={4} mb='sm'>Background</Title>
                <Table withTableBorder withColumnBorders>
                  <Table.Tbody>
                    {Object.entries(changePaperData.background)
                      .filter(([, value]) => value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <Table.Tr key={key}>
                          <Table.Td fw={600} style={{ width: '25%' }}>
                            {backgroundLabelMap[key] ?? key}
                          </Table.Td>
                          <Table.Td>
                            <Box dangerouslySetInnerHTML={{ __html: value ?? '' }} />
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </Box>
            )}

            {changePaperData.stereotypes.length > 0 && (
              <Box>
                <Title order={4} mb='sm'>Summary of Changes</Title>
                {changePaperData.stereotypes.map((stereotype) => (
                  <Box key={`summary-${stereotype.name}`} mb='md'>
                    <Title order={5} mb='xs'>{stereotype.name}</Title>
                    <Table withTableBorder withColumnBorders>
                      <Table.Tbody>
                        {stereotype.changes.map((change) => {
                          const anchor = changePaperAnchorId(stereotype.name, change.name);
                          return (
                            <Table.Tr key={anchor}>
                              <Table.Td style={{ width: '35%' }}>
                                <Anchor onClick={() => changePaperScrollTo(anchor)} style={{ cursor: 'pointer' }}>
                                  {change.name}
                                </Anchor>
                              </Table.Td>
                              <Table.Td>{change.summary}</Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </Box>
                ))}
              </Box>
            )}

            {changePaperData.stereotypes.length > 0 && (
              <Box>
                <Title order={4} mb='sm'>Changes</Title>
                {changePaperData.stereotypes.map((stereotype) => (
                  <Box key={`detail-${stereotype.name}`} mb='lg'>
                    <Title order={5} mb='xs'>{stereotype.name}</Title>
                    {stereotype.changes.map((change) => {
                      const anchor = changePaperAnchorId(stereotype.name, change.name);
                      return (
                        <Paper key={anchor} id={anchor} withBorder p='md' mb='sm'>
                          <Text fw={600} mb='xs'>{change.name}</Text>
                          <Divider mb='xs' />
                          <Box dangerouslySetInnerHTML={{ __html: change.detail ?? '' }} />
                        </Paper>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            )}
          </Stack>
        )}
      </Modal>

      <Modal
        opened={aboutOpened}
        onClose={() => setAboutOpened(false)}
        title={<Title order={3}>About</Title>}
        size='lg'
        centered
      >
        {aboutLoading && (
          <Stack align='center' gap='md' py='xl'>
            <Loader size='md' />
            <Text size='sm' c='dimmed'>Loading version information…</Text>
          </Stack>
        )}

        {!aboutLoading && aboutError && (
          <Alert color='red' mt='md'>{aboutError}</Alert>
        )}

        {!aboutLoading && (
          <Stack gap='md'>
            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td style={{ width: '50%' }} fw={600}>UI Version</Table.Td>
                  <Table.Td>{version}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>Mauro Data Mapper</Table.Td>
                  <Table.Td>{aboutData?.mauroVersion ?? (aboutError ? 'Unavailable' : '—')}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>NHS Data Dictionary Plugin</Table.Td>
                  <Table.Td>{aboutData?.pluginVersion ?? (aboutError ? 'Unavailable' : '—')}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
            {mauroBaseUrl && (
              <Text c='dimmed' size='sm'>
                <Anchor href={mauroBaseUrl} target='_blank' rel='noreferrer'>
                  Open Mauro Data Mapper
                </Anchor>{' '}
                for platform access and management.
              </Text>
            )}
          </Stack>
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
      <FindDialog
        opened={findOpened}
        onClose={closeFind}
        onSearch={findSearch}
        onSelect={selectFindResult}
      />
    </>
  );
}

export interface FeaturePageProps {
  title: string;
  description: string;
}

export function FeaturePage({ title, description }: FeaturePageProps): ReactElement {
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
  icon?: 'branch' | 'version';
}

export interface BranchPickerProps {
  value?: string | null;
  options: BranchPickerOption[];
  onChange: (value: string | null) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
}

function getBranchPickerIcon(optionIcon?: BranchPickerOption['icon']): typeof IconCircleCheck | typeof IconGitBranch {
  return optionIcon === 'version' ? IconCircleCheck : IconGitBranch;
}

function getBranchPickerIconColor(optionIcon?: BranchPickerOption['icon']): string {
  return optionIcon === 'version' ? 'green' : 'blue';
}

function getBranchPickerOptionIcon(option: BranchPickerOption | ComboboxItem): 'branch' | 'version' {
  const optionIcon = 'icon' in option && (option.icon === 'branch' || option.icon === 'version') ? option.icon : undefined;
  return optionIcon ?? 'branch';
}

export function BranchPicker({ value = null, options, onChange, size = 'sm', label = 'Current branch' }: BranchPickerProps): ReactElement {
  const selectOptions = options
    .filter((option) => typeof option?.value === 'string' && option.value.trim().length > 0)
    .map((option) => ({
      value: option.value,
      label: (option.label ?? option.value).toString(),
      icon: option.icon ?? 'branch'
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
  const inProgressBranches = selectOptions.filter((option) => option.icon === 'branch');
  const finalisedReleases = selectOptions.filter((option) => option.icon === 'version');
  const selectData: Array<ComboboxItemGroup<ComboboxItem> | ComboboxItem> = [];

  if (inProgressBranches.length > 0) {
    selectData.push({
      group: 'In-progress branches',
      items: inProgressBranches
    });
  }

  if (finalisedReleases.length > 0) {
    selectData.push({
      group: 'Finalised releases',
      items: finalisedReleases
    });
  }

  const selectedOption = selectOptions.find((option) => option.value === value);
  const SelectedIcon = selectedOption ? getBranchPickerIcon(selectedOption.icon) : null;

  return (
    <Select
      {...(label ? { label } : {})}
      placeholder='Select a branch'
      value={value}
      data={selectData}
      onChange={onChange}
      size={size}
      leftSection={
        selectedOption ? (
          <ThemeIcon
            variant='transparent'
            color={getBranchPickerIconColor(selectedOption.icon)}
            size='md'
            data-testid={`branch-picker-selected-icon-${selectedOption.icon}`}
          >
            {SelectedIcon ? <SelectedIcon size={18} aria-hidden='true' /> : null}
          </ThemeIcon>
        ) : undefined
      }
      leftSectionWidth={40}
      renderOption={({ option }) => {
        const optionIcon = getBranchPickerOptionIcon(option);
        const Icon = getBranchPickerIcon(optionIcon);

        return (
          <Group gap='sm' wrap='nowrap'>
            <ThemeIcon
              variant='transparent'
              color={getBranchPickerIconColor(optionIcon)}
              size='md'
              data-testid={`branch-picker-option-icon-${optionIcon}`}
            >
              <Icon size={18} aria-hidden='true' />
            </ThemeIcon>
            <span>{option.label}</span>
          </Group>
        );
      }}
    />
  );
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function PreviewBreadcrumb({ items }: { items: BreadcrumbItem[] }): ReactElement {
  return (
    <ul className='mdm-preview-breadcrumb'>
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

export function PreviewToc({ links, onNavigate }: PreviewTocProps): ReactElement | null {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className='mdm-preview-toc'>
      <div className='mdm-preview-toc__label'>On this page</div>
      <ul>
        {links.map((link) => (
          <li key={link.anchor}>
            <button type='button' className='mdm-preview-toc__link' onClick={() => onNavigate(link.anchor)}>
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
