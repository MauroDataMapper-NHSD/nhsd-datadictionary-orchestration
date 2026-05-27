import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  List,
  Loader,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton
} from '@mantine/core';
import {
  BranchStatistics,
  BranchSummary,
  IntegrityCheck,
  IntegrityCheckComponent,
  PreviewCodeReference,
  PreviewDetail,
  PreviewLinkItem,
  PreviewReference,
  createOrchestrationApiClient
} from 'api-client';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './app.module.scss';
import { BranchPicker, PageOption, PreviewBreadcrumb, PreviewToc, TocLink } from 'ui';
import {
  indexTitleMap,
  previewEndpointMap,
  previewRouteIndexAliases,
  previewTiles,
  stereotypeToRouteIndex
} from './pages/shared/helpers';
import type { PreviewIndexItem } from './pages/shared/helpers';

const apiBaseUrl =
  import.meta.env.VITE_MAURO_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8080';
const mauroBaseUrl = import.meta.env.VITE_MAURO_BASE_URL ?? 'http://localhost:4200';
const appVersion = import.meta.env.VITE_APP_VERSION ?? '1.0.0';

type RichPreviewDetail = PreviewDetail & {
  shortDescription?: string;
  attributeText?: string;
  formatLength?: string;
  definition?: string;
  stereotype?: string;
  isRetired?: boolean;
  isPreparatory?: boolean;
  retiredDate?: string;
  validFrom?: string;
  validTo?: string;
  titleCaseName?: string;
  websitePageHeading?: string;
  noAliasesRequired?: boolean;
  shortName?: string;
  alsoKnownAsText?: string;
  plural?: string;
  formerly?: string;
  fullName?: string;
  indexName?: string;
  alsoKnownAs?: Record<string, string>;
  nationalCodes?: PreviewCodeReference[];
  defaultCodes?: PreviewCodeReference[];
  attributes?: PreviewLinkItem[];
  relationships?: PreviewLinkItem[];
  childFolders?: PreviewLinkItem[];
  dataSets?: PreviewLinkItem[];
  dataElements?: PreviewLinkItem[];
  changeLog?: {
    headerText?: string;
    footerText?: string;
    entries?: Array<{
      reference?: string;
      referenceUrl?: string;
      description?: string;
      implementationDate?: string;
    }>;
  };
};

export interface BusinessDefinitionEditData {
  name: string;
  status: 'Preparatory' | 'Live' | 'Retired';
  retiredDate: string;
  validFrom: string;
  validTo: string;
  titleCaseName: string;
  websitePageHeading: string;
  noAliasesRequired: boolean;
  shortName: string;
  alsoKnownAs: string;
  plural: string;
  formerly: string;
  fullName: string;
  indexName: string;
  description: string;
}

function useApi() {
  return useMemo(() => createOrchestrationApiClient(apiBaseUrl), []);
}

function useBranches() {
  const api = useApi();
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getBranches()
      .then(setBranches)
      .catch(() => setError('Could not load branches.'))
      .finally(() => setLoading(false));
  }, [api]);

  return { branches, loading, error };
}

function sectionId(label: string) {
  return `section-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function getBranchLabel(branch: BranchSummary) {
  return branch.versionDisplay ?? branch.branchName ?? branch.name ?? branch.id ?? 'Unnamed branch';
}

function scrollToAnchor(anchor: string) {
  const element = document.getElementById(anchor);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function PreviewSection({
  title,
  children,
  defaultExpanded = true,
  onExpand
}: {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  onExpand?: () => void;
}) {
  const id = sectionId(title);
  const contentId = `${id}-content`;
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded((current) => {
      const next = !current;
      if (next) {
        onExpand?.();
      }
      return next;
    });
  };

  return (
    <article className="mdm-preview-expandable-panel">
      <div className="mdm-preview-expandable-panel__header">
        <h2 className="title topictitle2">
          <button type="button" onClick={handleToggle} aria-expanded={expanded} aria-controls={contentId}>
            <span aria-hidden="true">{expanded ? '▾' : '▸'}</span>
          </button>
          {title}
          <span id={id} />
        </h2>
      </div>
      <div
        id={contentId}
        className={`mdm-preview-expandable-panel__content ${expanded ? 'expanded' : 'collapsed'}`}
      >
        {children}
      </div>
    </article>
  );
}

function ChangeAnchorId(stereotype: string, name: string) {
  return `change-${stereotype}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function mapLinkIndex(stereotype: string | undefined) {
  return normalizePreviewRouteIndex(stereotype) ?? 'allItemsIndex';
}

function normalizePreviewRouteIndex(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const compact = value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return (
    previewRouteIndexAliases[compact] ??
    stereotypeToRouteIndex[value] ??
    previewRouteIndexAliases[value.toLowerCase()]
  );
}

function resolvePreviewEndpoint(index: string | undefined): string | undefined {
  const routeIndex = normalizePreviewRouteIndex(index);
  if (!routeIndex) {
    return undefined;
  }

  return previewEndpointMap[routeIndex];
}

function normalizePreviewItemId(value: unknown) {
  if (value === null || value === undefined) {
    return undefined;
  }

  const id = String(value).trim();
  if (!id) {
    return undefined;
  }

  const lower = id.toLowerCase();
  if (lower === 'undefined' || lower === 'null') {
    return undefined;
  }

  return id;
}

function resolvePreviewItemId(item: Record<string, unknown>) {
  const preferredKeys = [
    'catalogueId',
    'catalogueID',
    'catalogueid',
    'catalogueItemId',
    'itemId',
    'id',
    'attributeId',
    'dataElementId',
    'dataClassId',
    'dataSetId',
    'folderId'
  ];

  for (const key of preferredKeys) {
    const candidate = normalizePreviewItemId(item[key]);
    if (candidate) {
      return candidate;
    }
  }

  // Fallback for unexpected API field names that still represent a catalogue item id.
  for (const [key, value] of Object.entries(item)) {
    if (!/id$/i.test(key) || /(model|parent|branch)id$/i.test(key)) {
      continue;
    }

    const candidate = normalizePreviewItemId(value);
    if (candidate) {
      return candidate;
    }
  }

  return undefined;
}

function getPreviewItemClassName(item: {
  stereotype?: string;
  isRetired?: boolean;
  retired?: boolean;
}) {
  return [item.stereotype, item.isRetired || item.retired ? 'retired' : undefined]
    .filter(Boolean)
    .join(' ');
}

const previewTypeLabelMap: Record<string, string> = {
  element: 'Data Element',
  attribute: 'Attribute',
  class: 'Class',
  dataSet: 'Data Set',
  businessDefinition: 'Business Definition',
  supportingInformation: 'Supporting Information',
  dataSetConstraint: 'Data Set Constraint',
  dataSetFolder: 'Data Set Folder',
  allItemsIndex: 'All Items Index'
};

function prettifyPreviewStereotype(stereotype: string | undefined) {
  if (!stereotype) {
    return '-';
  }

  const normalized = normalizePreviewRouteIndex(stereotype);
  return (normalized && previewTypeLabelMap[normalized]) ?? stereotype;
}

function PreviewInfoMessage({ children }: { children: ReactNode }) {
  return <div className="info-message">{children}</div>;
}

function PreviewTable({ children, className }: { children: ReactNode; className?: string }) {
  const classes = ['simpletable', 'table', 'table-striped', 'table-sm', className]
    .filter(Boolean)
    .join(' ');

  return <Table className={classes}>{children}</Table>;
}

function getMauroComponentUrl(component: IntegrityCheckComponent): string {
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
}

export function HomePage() {
  return (
    <Card withBorder>
      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Title order={3}>
            Use the <strong>Data Dictionary Orchestrator</strong> to manage and publish the NHS Data Model and Dictionary via{' '}
            <Anchor href={mauroBaseUrl} target="_blank" rel="noreferrer">
              Mauro Data Mapper
            </Anchor>
            .
          </Title>
          <Text mt="md">With this application, you can:</Text>
          <List mt="sm" spacing="xs">
            <List.Item>Review the status of each branch of the NHS Data Model and Dictionary.</List.Item>
            <List.Item>Run integrity checks and review issues to fix in Mauro Data Mapper.</List.Item>
            <List.Item>Preview the content that will be published.</List.Item>
            <List.Item>Orchestrate publication outputs for the data dictionary.</List.Item>
          </List>
          <Text mt="md" fw={700}>
            This application is designed for administrators of the NHS Data Model and Dictionary.
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Box ta="center">
            <img src="/images/img.svg" alt="Mauro Data Mapper workflow" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

type ErrorVariant = 'not-authorized' | 'not-found' | 'not-implemented' | 'server-error';

const errorDetails: Record<ErrorVariant, { heading: string; message: string; resolution: string }> = {
  'not-authorized': {
    heading: 'Not Authorized',
    message: "We're sorry, but the server does not allow you to view this page.",
    resolution: 'Check that the requested item exists and that you have permission to view it.'
  },
  'not-found': {
    heading: 'Not Found',
    message: "We're sorry, but the server returned a Not Found error.",
    resolution: 'Check that the requested item exists and that the URL is correct.'
  },
  'not-implemented': {
    heading: 'Not Implemented',
    message: 'The requested feature has not yet been implemented on the server.',
    resolution: 'If you are on a test environment, this may be work in progress.'
  },
  'server-error': {
    heading: 'Server Error',
    message: "We're sorry, but the server responded with an error.",
    resolution: 'This may be temporary. Please try again later.'
  }
};

export function ErrorStatePage({ variant }: { variant: ErrorVariant }) {
  const detail = errorDetails[variant];

  return (
    <Stack>
      <Alert color="red" title={detail.heading}>{detail.message}</Alert>
      <Text>{detail.resolution}</Text>
    </Stack>
  );
}

export function BranchesPage() {
  const { branches, loading, error } = useBranches();
  const navigate = useNavigate();
  const location = useLocation();
  const showInitialBranchPicker = (location.state as { showInitialBranchPicker?: boolean } | null)?.showInitialBranchPicker === true;
  const selectedBranchId = localStorage.getItem('selectedBranchId');

  useEffect(() => {
    if (!showInitialBranchPicker && selectedBranchId) {
      navigate(`/branches/${selectedBranchId}/statistics`, { replace: true });
    }
  }, [navigate, selectedBranchId, showInitialBranchPicker]);

  if (loading) return <Loader />;
  if (!showInitialBranchPicker && selectedBranchId) return <Loader />;

  return (
    <Stack>
      {showInitialBranchPicker ? (
        <Card withBorder p="xl" className={styles.initialBranchCard}>
          <Title order={2}>Which branch would you like to start working with?</Title>
          <Text mt="sm">Choose a branch to view statistics, integrity checks, and publishing actions.</Text>
          <Box mt="lg" className={styles.largeBranchPicker}>
            <BranchPicker
              label="Start with branch"
              size="lg"
              options={branches.map((branch) => ({ value: branch.id, label: getBranchLabel(branch) }))}
              onChange={(value) => value && navigate(`/branches/${value}/statistics`)}
            />
          </Box>
        </Card>
      ) : (
        <Card withBorder>
          <Title order={3}>Branch workspace</Title>
          <Text mt="sm">Use the branch selector under the main header to switch branch context at any time.</Text>
        </Card>
      )}

      {error && <Alert color="red">{error}</Alert>}
    </Stack>
  );
}

export function BranchDetailPage() {
  const api = useApi();
  const { branch: branchId, tabView } = useParams();
  const [branch, setBranch] = useState<BranchSummary | null>(null);
  const [stats, setStats] = useState<BranchStatistics | null>(null);
  const [checks, setChecks] = useState<IntegrityCheck[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<IntegrityCheck | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingChecks, setLoadingChecks] = useState(false);

  const activeTab = tabView ?? 'statistics';
  const navigate = useNavigate();

  useEffect(() => {
    if (!branchId) return;
    api
      .getBranches()
      .then((items) => setBranch(items.find((item) => item.id === branchId) ?? null));
  }, [api, branchId]);

  const runStats = () => {
    if (!branchId) return;
    setLoadingStats(true);
    api
      .getBranchStatistics(branchId)
      .then(setStats)
      .finally(() => setLoadingStats(false));
  };

  const runChecks = () => {
    if (!branchId) return;
    setLoadingChecks(true);
    setSelectedCheck(null);
    api
      .getIntegrityChecks(branchId)
      .then((result) => {
        setChecks(result);
        if (result.length > 0) {
          setSelectedCheck(result[0]);
        }
      })
      .finally(() => setLoadingChecks(false));
  };

  if (!branchId) {
    return <Alert color="yellow">No branch selected.</Alert>;
  }

  return (
    <Stack>
      <Title order={2}>{branch ? getBranchLabel(branch) : branchId}</Title>
      <Tabs value={activeTab} onChange={(value) => value && navigate(`/branches/${branchId}/${value}`)}>
        <Tabs.List>
          <Tabs.Tab value="statistics">Statistics</Tabs.Tab>
          <Tabs.Tab value="integrity">Integrity</Tabs.Tab>
          <Tabs.Tab value="publish">Publish</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="statistics" pt="md">
          <Stack>
            <Text>
              Generate statistics on the <strong>{branch ? getBranchLabel(branch) : branchId}</strong> branch.
            </Text>
            <Group>
              <Button onClick={runStats} loading={loadingStats}>Run</Button>
            </Group>
            {loadingStats && (
              <Text size="sm" c="dimmed">Generating statistics now, please wait...</Text>
            )}
            {!loadingStats && stats && (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Preparatory</Table.Th>
                    <Table.Th>Retired</Table.Th>
                    <Table.Th>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Object.entries(stats).map(([name, values]) => (
                    <Table.Tr key={name}>
                      <Table.Td><strong>{name}</strong></Table.Td>
                      <Table.Td>{values.Preparatory ?? 0}</Table.Td>
                      <Table.Td>{values.Retired ?? 0}</Table.Td>
                      <Table.Td>{values.Total ?? 0}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="integrity" pt="md">
          <Stack>
            <Text>
              Run integrity checks on the <strong>{branch ? getBranchLabel(branch) : branchId}</strong> branch.
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Note:</strong> These integrity checks only provide guidance on issues to investigate further.
              The Data Dictionary can still be modified with these issues in place.
            </Text>
            <Group>
              <Button onClick={runChecks} loading={loadingChecks}>Run</Button>
            </Group>
            {loadingChecks && (
              <Text size="sm" c="dimmed">Running integrity checks now, please wait...</Text>
            )}
            {!loadingChecks && checks.length > 0 && (
              <Grid>
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <ScrollArea mah={500}>
                    <Stack gap="xs">
                      {checks.map((check) => {
                        const hasErrors = (check.errors?.length ?? 0) > 0;
                        const isSelected = selectedCheck?.checkName === check.checkName;
                        return (
                          <UnstyledButton
                            key={check.checkName}
                            onClick={() => setSelectedCheck(check)}
                            p="xs"
                            style={{
                              borderRadius: 4,
                              backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : undefined,
                              border: isSelected ? '1px solid var(--mantine-color-blue-3)' : '1px solid transparent'
                            }}
                          >
                            <Group gap="xs" wrap="nowrap">
                              <ThemeIcon
                                color={hasErrors ? 'red' : 'green'}
                                variant="light"
                                size="sm"
                                style={{ flexShrink: 0 }}
                              >
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
                          </UnstyledButton>
                        );
                      })}
                    </Stack>
                  </ScrollArea>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 7 }}>
                  {!selectedCheck && (
                    <Text size="sm" c="dimmed" fs="italic">Select a category to view further details.</Text>
                  )}
                  {selectedCheck && (
                    <Card withBorder>
                      <Title order={4}>{selectedCheck.checkName}</Title>
                      <Text size="sm" mt="xs">{selectedCheck.description}</Text>
                      <Divider my="sm" />
                      {(selectedCheck.errors?.length ?? 0) === 0 ? (
                        <Group gap="xs">
                          <ThemeIcon color="green" variant="light" size="sm">✓</ThemeIcon>
                          <Text size="sm" c="green">No issues found</Text>
                        </Group>
                      ) : (
                        <Stack gap="xs">
                          <Group gap="xs">
                            <ThemeIcon color="red" variant="light" size="sm">!</ThemeIcon>
                            <Text size="sm" c="red">{selectedCheck.errors.length} issue(s) found</Text>
                          </Group>
                          <ScrollArea mah={350}>
                            <Stack gap="xs">
                              {selectedCheck.errors.map((error, idx) => (
                                <Paper key={idx} withBorder p="xs">
                                  {error.component?.domainType && (
                                    <Text size="xs" c="dimmed" mb={2}>{error.component.domainType}</Text>
                                  )}
                                  {error.component ? (
                                    <Anchor
                                      href={getMauroComponentUrl(error.component)}
                                      target="_blank"
                                      rel="noreferrer"
                                      size="sm"
                                    >
                                      {error.component.label}
                                    </Anchor>
                                  ) : null}
                                  {error.details?.map((detail, di) => (
                                    <Text key={di} size="xs" c="dimmed" mt={2}>{detail}</Text>
                                  ))}
                                </Paper>
                              ))}
                            </Stack>
                          </ScrollArea>
                        </Stack>
                      )}
                    </Card>
                  )}
                </Grid.Col>
              </Grid>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="publish" pt="md">
          <Stack>
            <Text>
              Publish actions for <strong>{branch ? getBranchLabel(branch) : branchId}</strong> are now available in
              the header <strong>Menu</strong> under <strong>Publish</strong>.
            </Text>
            <Card withBorder>
              <Title order={4}>Other reports</Title>
              <Stack mt="sm">
                <Group justify="space-between">
                  <Text size="sm">Generate Data Element usage spreadsheet</Text>
                  <Button disabled title="Not yet implemented">
                    Generate
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

export function PreviewDefaultPage() {
  const { branches, loading } = useBranches();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedBranchId = localStorage.getItem('selectedBranchId');
  const showInitialBranchPicker =
    (location.state as { showInitialBranchPicker?: boolean } | null)?.showInitialBranchPicker === true;

  useEffect(() => {
    if (!showInitialBranchPicker && selectedBranchId) {
      navigate(`/preview/${selectedBranchId}`, { replace: true });
    }
  }, [navigate, selectedBranchId, showInitialBranchPicker]);

  if (loading) return <Loader />;
  if (!showInitialBranchPicker && selectedBranchId) return <Loader />;

  return (
    <div className="mdm-dd-preview">
      {showInitialBranchPicker ? (
        <Card withBorder p="xl" className={styles.initialBranchCard}>
          <Title order={2}>Which branch would you like to start working with?</Title>
          <Text mt="sm">Choose a branch to start previewing the data dictionary.</Text>
          <Box mt="lg" className={styles.largeBranchPicker}>
            <BranchPicker
              label="Start with branch"
              size="lg"
              options={branches.map((branch) => ({ value: branch.id, label: getBranchLabel(branch) }))}
              onChange={(value) => value && navigate(`/preview/${value}`, { replace: true })}
            />
          </Box>
        </Card>
      ) : (
        <div className="mdm-shadow-block">
          <div className="mdm-preview-default">
            <h3>Data Dictionary Preview</h3>
            <p>No branch selected yet. Choose a branch using the selector under the header.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function PreviewHomePage() {
  const { branch: branchId } = useParams();

  if (!branchId) {
    return <Alert color="yellow">No branch selected.</Alert>;
  }

  return (
    <div className="mdm-dd-preview mdm-preview-home">
      <Grid align="center" gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <h2>Welcome to the NHS Data Model and Dictionary for England.</h2>
          <p>
            The NHS Data Model and Dictionary provides a reference point for approved Information Standards Notices to
            support health care activities within the NHS in England. It has been developed for everyone who is
            actively involved in the collection of data and the management of information in the NHS.
          </p>
          <p>
            The NHS Data Model and Dictionary is maintained and published by the{' '}
            <Anchor href="https://digital.nhs.uk/services/nhs-data-model-and-dictionary-service" target="_blank" rel="noreferrer">
              NHS Data Model and Dictionary Service
            </Anchor>
            .
          </p>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box ta="center">
            <img
              className="preview-home-image"
              src="/images/4pics.gif"
              alt="NHS Data Dictionary images"
            />
          </Box>
        </Grid.Col>
      </Grid>

      <div className="mdm-preview-home__tile-container">
        {previewTiles.map((tile) => (
          <div className="mdm-preview-tile" key={tile.index}>
            <div>
              <div className="mdm-preview-tile__text">
                <div className="mdm-preview-tile__text__title">
                  <span>
                    <Anchor
                      component={Link}
                      to={
                        tile.index === 'dataSetFolder'
                          ? `/preview/${branchId}/dataSetFolder/root`
                          : `/preview/${branchId}/${tile.index}`
                      }
                    >
                      {tile.title}
                    </Anchor>
                  </span>
                </div>
                <div className="mdm-preview-tile__text__description">{tile.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PreviewIndexPage() {
  const api = useApi();
  const { branch: branchId, index } = useParams();
  const [items, setItems] = useState<PreviewIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const normalizedIndex = normalizePreviewRouteIndex(index);
  const endpoint = resolvePreviewEndpoint(index);

  useEffect(() => {
    if (!branchId || !endpoint || !normalizedIndex) return;
    setLoading(true);
    api
      .getPreviewIndex(branchId, endpoint)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [api, branchId, endpoint, normalizedIndex]);

  if (!branchId || !normalizedIndex || !endpoint) {
    return <Alert color="yellow">Preview index route is incomplete.</Alert>;
  }

  if (loading) return <Loader />;

  const grouped = items.reduce<Record<string, PreviewIndexItem[]>>((acc, item) => {
    const key = item.name?.charAt(0).toUpperCase() ?? '#';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  const groups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  const tocLinks = groups.map(([key]) => ({ label: key, anchor: sectionId(key) }));

  return (
    <div className="mdm-dd-preview">
      <PreviewBreadcrumb
        items={[
          { label: 'Preview', to: `/preview/${branchId}` },
          { label: indexTitleMap[normalizedIndex] ?? normalizedIndex }
        ]}
      />
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 10 }}>
          <div>
            <h1 className="title topictitle1">{indexTitleMap[normalizedIndex] ?? normalizedIndex}</h1>
            <PreviewInfoMessage>
              For preview only, this index page does not include the final published description block. The final
              published output will include a description.
            </PreviewInfoMessage>
            {groups.map(([key, groupItems]) => (
              <PreviewSection key={key} title={key}>
                <div className="simpletable-container">
                <PreviewTable>
                  <Table.Thead>
                    <Table.Tr className="thead-light">
                      <Table.Th>Item Name</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {groupItems.map((item) => (
                      <Table.Tr key={resolvePreviewItemId(item) || item.name}>
                        <Table.Td>
                          {resolvePreviewItemId(item) ? (
                            <Anchor
                              className={getPreviewItemClassName(item)}
                              component={Link}
                              to={`/preview/${branchId}/${mapLinkIndex(item.stereotype)}/${resolvePreviewItemId(item)}`}
                            >
                              {item.name}
                            </Anchor>
                          ) : (
                            <span className={getPreviewItemClassName(item)}>{item.name}</span>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </PreviewTable>
                </div>
              </PreviewSection>
            ))}
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <PreviewToc links={tocLinks} onNavigate={scrollToAnchor} />
        </Grid.Col>
      </Grid>
    </div>
  );
}

export function PreviewDetailPage({
  onPageOptionsChange,
  onEditBusinessDefinition
}: {
  onPageOptionsChange?: (options: PageOption[]) => void;
  onEditBusinessDefinition?: (data: BusinessDefinitionEditData) => void;
}) {
  const api = useApi();
  const { branch: branchId, index, id } = useParams();
  const [detail, setDetail] = useState<RichPreviewDetail | null>(null);
  const [references, setReferences] = useState<PreviewReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const normalizedIndex = normalizePreviewRouteIndex(index);
  const endpoint = resolvePreviewEndpoint(index);

   useEffect(() => {
     if (!branchId || !endpoint || !id) return;
     setLoading(true);
     api
       .getPreviewDetail(branchId, endpoint, id)
       .then((response) => setDetail(response as RichPreviewDetail))
       .catch((error) => {
         console.error('Failed to load preview detail:', error);
         setDetail(null);
       })
       .finally(() => setLoading(false));
   }, [api, branchId, endpoint, id]);

   const loadReferences = () => {
     if (!branchId || !endpoint || !id) return;
     setLoadingRefs(true);
     api
       .getPreviewReferences(branchId, endpoint, id)
       .then(setReferences)
       .catch((error) => {
         console.error('Failed to load preview references:', error);
         setReferences([]);
       })
       .finally(() => setLoadingRefs(false));
   };

  const isBusinessDefinitionPreview =
    normalizedIndex === 'businessDefinition' ||
    normalizePreviewRouteIndex(detail?.stereotype) === 'businessDefinition';

  useEffect(() => {
    if (!detail || !isBusinessDefinitionPreview || !onPageOptionsChange) {
      onPageOptionsChange?.([]);
      return;
    }

    onPageOptionsChange([
      {
        label: 'Edit this page...',
        onClick: () =>
          onEditBusinessDefinition?.({
            name: detail.name,
            status: detail.isRetired ? 'Retired' : detail.isPreparatory ? 'Preparatory' : 'Live',
            retiredDate: detail.retiredDate ?? '',
            validFrom: detail.validFrom ?? '',
            validTo: detail.validTo ?? '',
            titleCaseName: detail.titleCaseName ?? '',
            websitePageHeading: detail.websitePageHeading ?? '',
            noAliasesRequired: !!detail.noAliasesRequired,
            shortName: detail.shortName ?? '',
            alsoKnownAs: detail.alsoKnownAsText ?? '',
            plural: detail.plural ?? '',
            formerly: detail.formerly ?? '',
            fullName: detail.fullName ?? '',
            indexName: detail.indexName ?? '',
            description: detail.description ?? ''
          })
      }
    ]);

    return () => onPageOptionsChange([]);
  }, [detail, isBusinessDefinitionPreview, onEditBusinessDefinition, onPageOptionsChange]);

  if (!branchId || !normalizedIndex || !id) {
    return <Alert color="yellow">Preview detail route is incomplete.</Alert>;
  }

  if (loading) return <Loader />;
  if (!detail) return <Alert color="yellow">No detail found for this preview item.</Alert>;

  const aliases = detail.alsoKnownAs ? Object.entries(detail.alsoKnownAs) : [];
  const showWhereUsed = !detail.isRetired && !detail.isPreparatory;

  const tocLinks: TocLink[] = [];
  if (detail.formatLength) tocLinks.push({ label: 'Format / Length', anchor: sectionId('Format / Length') });
  if (detail.description) tocLinks.push({ label: 'Description', anchor: sectionId('Description') });
  if (detail.nationalCodes?.length) tocLinks.push({ label: 'National Codes', anchor: sectionId('National Codes') });
  if (detail.defaultCodes?.length) tocLinks.push({ label: 'Default Codes', anchor: sectionId('Default Codes') });
  if (detail.definition) tocLinks.push({ label: 'Specification', anchor: sectionId('Specification') });
  if (detail.attributes?.length) tocLinks.push({ label: 'Attributes', anchor: sectionId('Attributes') });
  if (detail.relationships?.length) tocLinks.push({ label: 'Relationships', anchor: sectionId('Relationships') });
  if (detail.childFolders?.length) tocLinks.push({ label: 'Folders', anchor: sectionId('Folders') });
  if (detail.dataSets?.length) tocLinks.push({ label: 'Data Sets', anchor: sectionId('Data Sets') });
  if (aliases.length > 0) tocLinks.push({ label: 'Also Known As', anchor: sectionId('Also Known As') });
  if (showWhereUsed) tocLinks.push({ label: 'Where Used', anchor: sectionId('Where Used') });
  if (detail.dataElements?.length) tocLinks.push({ label: 'Data Elements', anchor: sectionId('Data Elements') });
  tocLinks.push({ label: 'Change Log', anchor: sectionId('Change Log') });

   const renderLinkList = (items: PreviewLinkItem[]) => (
     <div className="- topic/body body">
       <ul>
         {items.map((item) => (
           <li key={resolvePreviewItemId(item) || item.name}>
             {resolvePreviewItemId(item) ? (
               <Anchor
                 className={getPreviewItemClassName(item)}
                 component={Link}
                 to={`/preview/${branchId}/${mapLinkIndex(item.stereotype)}/${resolvePreviewItemId(item)}`}
               >
                 {item.name}
               </Anchor>
             ) : (
               <span className={getPreviewItemClassName(item)}>{item.name}</span>
             )}
           </li>
         ))}
       </ul>
     </div>
   );

  return (
    <div className="mdm-dd-preview">
      <PreviewBreadcrumb
        items={[
          { label: 'Preview', to: `/preview/${branchId}` },
          {
            label: indexTitleMap[normalizedIndex] ?? normalizedIndex,
            to: `/preview/${branchId}/${normalizedIndex}`
          },
          { label: detail.name }
        ]}
      />

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 10 }}>
          <div className="mdm-preview-detail">
            <h1 className={`title topictitle1 ${getPreviewItemClassName(detail)}`}>{detail.name}</h1>
            {detail.shortDescription && (
              <div className="- topic/body body">
                <p className="- topic/shortdesc shortdesc" dangerouslySetInnerHTML={{ __html: detail.shortDescription }} />
              </div>
            )}

            {detail.formatLength && (
              <PreviewSection title="Format / Length">
                <div className="- topic/body body">
                  <div className="- topic/div div">
                    <p className="- topic/p p" dangerouslySetInnerHTML={{ __html: detail.formatLength }} />
                  </div>
                </div>
              </PreviewSection>
            )}

            {detail.description && (
              <PreviewSection title="Description">
                <div className="- topic/body body">
                  <div className="- topic/div div">
                {detail.attributeText && (
                  <p className="- topic/p p" dangerouslySetInnerHTML={{ __html: detail.attributeText }} />
                )}
                <p className="- topic/p p" dangerouslySetInnerHTML={{ __html: detail.description }} />
                  </div>
                </div>
              </PreviewSection>
            )}

            {detail.nationalCodes && detail.nationalCodes.length > 0 && (
              <PreviewSection title="National Codes">
                <div className="- topic/body body">
                <div className="simpletable-container">
                <PreviewTable className="codes-table">
                  <Table.Thead>
                    <Table.Tr className="thead-light">
                      <Table.Th>Code</Table.Th>
                      <Table.Th>Description</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {detail.nationalCodes.map((code) => (
                      <Table.Tr key={code.code}>
                        <Table.Td>{code.code}</Table.Td>
                        <Table.Td>
                          <Box dangerouslySetInnerHTML={{ __html: code.description }} />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </PreviewTable>
                </div>
                </div>
              </PreviewSection>
            )}

            {detail.defaultCodes && detail.defaultCodes.length > 0 && (
              <PreviewSection title="Default Codes">
                <div className="- topic/body body">
                <div className="simpletable-container">
                <PreviewTable className="codes-table">
                  <Table.Thead>
                    <Table.Tr className="thead-light">
                      <Table.Th>Code</Table.Th>
                      <Table.Th>Description</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {detail.defaultCodes.map((code) => (
                      <Table.Tr key={code.code}>
                        <Table.Td>{code.code}</Table.Td>
                        <Table.Td>
                          <Box dangerouslySetInnerHTML={{ __html: code.description }} />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </PreviewTable>
                </div>
                </div>
              </PreviewSection>
            )}

            {detail.definition && (
              <PreviewSection title="Specification">
                <div className="specification" dangerouslySetInnerHTML={{ __html: detail.definition }} />
              </PreviewSection>
            )}

            {detail.attributes && detail.attributes.length > 0 && (
              detail.stereotype === 'class' ? (
                <PreviewSection title="Attributes">
                  <div className="- topic/body body">
                  <div className="simpletable-container">
                  <PreviewTable className="attribute-table">
                    <Table.Thead>
                      <Table.Tr className="thead-light">
                        <Table.Th style={{ width: '10%' }}>Key</Table.Th>
                        <Table.Th>Attribute Name</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                       {detail.attributes.map((item) => (
                         <Table.Tr key={resolvePreviewItemId(item) || item.name}>
                           <Table.Td>{item.key ?? '-'}</Table.Td>
                           <Table.Td>
                             {resolvePreviewItemId(item) ? (
                               <Anchor
                                  className={getPreviewItemClassName(item)}
                                 component={Link}
                                 to={`/preview/${branchId}/${mapLinkIndex(item.stereotype)}/${resolvePreviewItemId(item)}`}
                               >
                                 {item.name}
                               </Anchor>
                             ) : (
                                <span className={getPreviewItemClassName(item)}>{item.name}</span>
                             )}
                           </Table.Td>
                         </Table.Tr>
                       ))}
                    </Table.Tbody>
                  </PreviewTable>
                  </div>
                  </div>
                </PreviewSection>
              ) : (
                <PreviewSection title="Attributes">{renderLinkList(detail.attributes)}</PreviewSection>
              )
            )}

            {detail.relationships && detail.relationships.length > 0 && (
              <PreviewSection title="Relationships">
                <div className="- topic/body body">
                  <p className="- topic/p p">Each {detail.name}</p>
                <div className="simpletable-container">
                <PreviewTable className="relationship-table">
                  <Table.Thead>
                    <Table.Tr className="thead-light">
                      <Table.Th>Key</Table.Th>
                      <Table.Th>Relationship</Table.Th>
                      <Table.Th>Class</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {detail.relationships.map((relationship) => (
                      <Table.Tr key={resolvePreviewItemId(relationship) || relationship.name}>
                        <Table.Td>{relationship.key ?? '-'}</Table.Td>
                        <Table.Td>{relationship.relationship ?? '-'}</Table.Td>
                        <Table.Td>
                          {resolvePreviewItemId(relationship) ? (
                            <Anchor
                              className={getPreviewItemClassName(relationship)}
                              component={Link}
                              to={`/preview/${branchId}/${mapLinkIndex(relationship.stereotype)}/${resolvePreviewItemId(relationship)}`}
                            >
                              {relationship.name}
                            </Anchor>
                          ) : (
                            <span className={getPreviewItemClassName(relationship)}>{relationship.name}</span>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </PreviewTable>
                </div>
                </div>
              </PreviewSection>
            )}

            {detail.childFolders && detail.childFolders.length > 0 && (
              <PreviewSection title="Folders">{renderLinkList(detail.childFolders)}</PreviewSection>
            )}

            {detail.dataSets && detail.dataSets.length > 0 && (
              <PreviewSection title="Data Sets">{renderLinkList(detail.dataSets)}</PreviewSection>
            )}

            {aliases.length > 0 && (
              <PreviewSection title="Also Known As">
                <div className="- topic/body body">
                  <p className="- topic/p p">This {prettifyPreviewStereotype(detail.stereotype).toLowerCase()} is also known by these names:</p>
                <div className="simpletable-container">
                <PreviewTable className="alias-table">
                  <Table.Thead>
                    <Table.Tr className="thead-light">
                      <Table.Th>Context</Table.Th>
                      <Table.Th>Alias</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {aliases.map(([context, value]) => (
                      <Table.Tr key={context}>
                        <Table.Td>{context}</Table.Td>
                        <Table.Td>{value}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </PreviewTable>
                </div>
                </div>
              </PreviewSection>
            )}

            {showWhereUsed && (
              <PreviewSection
                title="Where Used"
                defaultExpanded={false}
                onExpand={() => {
                  if (!loadingRefs && references.length === 0) {
                    loadReferences();
                  }
                }}
              >
                {loadingRefs && (
                  <PreviewInfoMessage>Loading references, please wait...</PreviewInfoMessage>
                )}
                {references.length > 0 && (
                  <div className="- topic/body body">
                  <div className="simpletable-container">
                  <PreviewTable>
                    <Table.Thead>
                      <Table.Tr className="thead-light">
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Link</Table.Th>
                        <Table.Th>How used</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                       {references.map((reference, idx) => (
                         <Table.Tr key={resolvePreviewItemId(reference) || idx}>
                            <Table.Td>{prettifyPreviewStereotype(reference.stereotype)}</Table.Td>
                           <Table.Td>
                             {resolvePreviewItemId(reference) ? (
                               <Anchor
                                  className={getPreviewItemClassName(reference)}
                                 component={Link}
                                 to={`/preview/${branchId}/${mapLinkIndex(reference.stereotype)}/${resolvePreviewItemId(reference)}`}
                               >
                                 {reference.name ?? resolvePreviewItemId(reference)}
                               </Anchor>
                             ) : (
                               reference.name ?? '-'
                             )}
                           </Table.Td>
                           <Table.Td>{reference.description ?? '-'}</Table.Td>
                         </Table.Tr>
                       ))}
                    </Table.Tbody>
                  </PreviewTable>
                  </div>
                  </div>
                )}
              </PreviewSection>
            )}

            {detail.dataElements && detail.dataElements.length > 0 && (
              <PreviewSection title="Data Elements">{renderLinkList(detail.dataElements)}</PreviewSection>
            )}

            <PreviewSection title="Change Log">
              {detail.changeLog?.headerText && (
                <div className="- topic/body body">
                  <p className="- topic/p p" dangerouslySetInnerHTML={{ __html: detail.changeLog.headerText }} />
                </div>
              )}
              {detail.changeLog?.entries && detail.changeLog.entries.length > 0 && (
                <div className="- topic/body body">
                <div className="simpletable-container">
                <PreviewTable>
                  <Table.Thead>
                    <Table.Tr className="thead-light">
                      <Table.Th>Change Request</Table.Th>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>Implementation Date</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {detail.changeLog.entries.map((entry, idx) => (
                      <Table.Tr key={`${entry.reference ?? 'entry'}-${idx}`}>
                        <Table.Td>
                          {entry.referenceUrl ? (
                            <Anchor href={entry.referenceUrl} target="_blank" rel="noreferrer">
                              {entry.reference}
                            </Anchor>
                          ) : (
                            entry.reference ?? '-'
                          )}
                        </Table.Td>
                        <Table.Td>{entry.description ?? '-'}</Table.Td>
                        <Table.Td>{entry.implementationDate ?? '-'}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </PreviewTable>
                </div>
                </div>
              )}
              {detail.changeLog?.footerText && (
                <div className="- topic/body body">
                  <p className="- topic/p p" dangerouslySetInnerHTML={{ __html: detail.changeLog.footerText }} />
                </div>
              )}
            </PreviewSection>
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <PreviewToc links={tocLinks} onNavigate={scrollToAnchor} />
        </Grid.Col>
      </Grid>
    </div>
  );
}






























































