import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  List,
  Loader,
  Modal,
  Paper,
  Progress,
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
import { notifications } from '@mantine/notifications';
import {
  BranchStatistics,
  BranchSummary,
  ChangePaperPreview,
  GeneratedArtifact,
  IntegrityCheck,
  IntegrityCheckComponent,
  MauroModule,
  MauroStatus,
  PreviewCodeReference,
  PreviewDetail,
  PreviewLinkItem,
  PreviewReference,
  createOrchestrationApiClient
} from 'api-client';
import { saveAs } from 'file-saver';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BranchPicker, PreviewBreadcrumb, PreviewToc, TocLink } from 'ui';

const apiBaseUrl =
  import.meta.env.VITE_MAURO_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8080';
const mauroBaseUrl = import.meta.env.VITE_MAURO_BASE_URL ?? 'http://localhost:4200';
const appVersion = import.meta.env.VITE_APP_VERSION ?? '1.0.0';

type PreviewIndexItem = {
  catalogueId?: string;
  id?: string;
  name: string;
  stereotype: string;
  isRetired: boolean;
};

const previewEndpointMap: Record<string, string> = {
  element: 'elements',
  attribute: 'attributes',
  class: 'classes',
  dataSet: 'dataSets',
  businessDefinition: 'businessDefinitions',
  supportingInformation: 'supportingInformation',
  dataSetConstraint: 'dataSetConstraints',
  dataSetFolder: 'dataSetFolders',
  allItemsIndex: 'allItemsIndex'
};

const previewRouteIndexAliases: Record<string, string> = {
  element: 'element',
  elements: 'element',
  dataelement: 'element',
  dataelements: 'element',
  attribute: 'attribute',
  attributes: 'attribute',
  class: 'class',
  classes: 'class',
  dataclass: 'class',
  dataclasses: 'class',
  dataset: 'dataSet',
  datasets: 'dataSet',
  businessdefinition: 'businessDefinition',
  businessdefinitions: 'businessDefinition',
  supportinginformation: 'supportingInformation',
  datasetconstraint: 'dataSetConstraint',
  datasetconstraints: 'dataSetConstraint',
  datasetfolder: 'dataSetFolder',
  datasetfolders: 'dataSetFolder',
  allitemsindex: 'allItemsIndex'
};

const stereotypeToRouteIndex: Record<string, string> = {
  element: 'element',
  attribute: 'attribute',
  class: 'class',
  dataSet: 'dataSet',
  businessDefinition: 'businessDefinition',
  supportingInformation: 'supportingInformation',
  dataSetConstraint: 'dataSetConstraint',
  dataSetFolder: 'dataSetFolder',
  allItemsIndex: 'allItemsIndex'
};

const indexTitleMap: Record<string, string> = {
  element: 'Data Elements',
  attribute: 'Attributes',
  class: 'Classes',
  dataSet: 'Data Sets',
  businessDefinition: 'NHS Business Definitions',
  supportingInformation: 'Supporting Information',
  dataSetConstraint: 'Data Set Constraints',
  dataSetFolder: 'Data Set Folders',
  allItemsIndex: 'All Items Index'
};

const previewTiles = [
  {
    index: 'dataSetFolder',
    title: 'Data Sets',
    description: 'Data Sets provide the specification for data collections and analyses.'
  },
  {
    index: 'element',
    title: 'Data Elements',
    description: 'Data Elements are the data items used within data sets.'
  },
  {
    index: 'attribute',
    title: 'Attributes',
    description: 'Attributes define characteristics of classes in the data model.'
  },
  {
    index: 'class',
    title: 'Classes',
    description: 'Classes describe significant aspects of the health and care business.'
  },
  {
    index: 'businessDefinition',
    title: 'NHS Business Definitions',
    description: 'Links logical classes to health and care business context.'
  },
  {
    index: 'supportingInformation',
    title: 'Supporting Information',
    description: 'Additional guidance to understand NHS Data Model content.'
  },
  {
    index: 'dataSetConstraint',
    title: 'Data Set Constraints',
    description: 'Constraint information applied to data set content.'
  },
  {
    index: 'allItemsIndex',
    title: 'All Items Index',
    description: 'Lists all items in the dictionary alphabetically.'
  }
];

type RichPreviewDetail = PreviewDetail & {
  shortDescription?: string;
  attributeText?: string;
  formatLength?: string;
  definition?: string;
  stereotype?: string;
  isRetired?: boolean;
  isPreparatory?: boolean;
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
  return branch.versionDisplay ?? branch.branchName ?? branch.name;
}

function scrollToAnchor(anchor: string) {
  const element = document.getElementById(anchor);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function PreviewSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  const id = sectionId(title);

  return (
    <Card withBorder id={id}>
      <Title order={4} mb="sm">{title}</Title>
      {children}
    </Card>
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

function downloadArtifact(artifact: GeneratedArtifact) {
  saveAs(artifact.blob, artifact.filename);
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

type ProgressModal = {
  title: string;
  message: string;
};

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

export function AboutPage() {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [mauroVersion, setMauroVersion] = useState('');
  const [pluginVersion, setPluginVersion] = useState('');

  useEffect(() => {
    Promise.all([api.getMauroStatus(), api.getMauroModules()])
      .then(([status, modules]) => {
        const typedStatus = status as MauroStatus;
        const typedModules = modules as MauroModule[];
        setMauroVersion(typedStatus['Mauro Data Mapper Version'] ?? 'Unknown');
        setPluginVersion(
          typedModules.find((module) => module.name === 'mdm.pluginNhsDataDictionary')
            ?.version ?? 'Unknown'
        );
      })
      .catch(() => {
        setMauroVersion('Unavailable');
        setPluginVersion('Unavailable');
      })
      .finally(() => setIsLoading(false));
  }, [api]);

  return (
    <Stack>
      <Title order={2}>About</Title>
      <Table>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td style={{ width: '35%' }}>UI Version</Table.Td>
            <Table.Td>{appVersion}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Mauro Data Mapper</Table.Td>
            <Table.Td>{isLoading ? 'Loading...' : mauroVersion}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>NHS Data Dictionary Plugin</Table.Td>
            <Table.Td>{isLoading ? 'Loading...' : pluginVersion}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Text c="dimmed">
        <Anchor href={mauroBaseUrl} target="_blank" rel="noreferrer">
          Open Mauro Data Mapper
        </Anchor>{' '}
        for platform access and management.
      </Text>
    </Stack>
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

  if (loading) return <Loader />;

  return (
    <Stack>
      <Title order={2}>Branches</Title>
      <Text>Please select a branch to view statistics, integrity checks, and publishing actions.</Text>
      {error && <Alert color="red">{error}</Alert>}
      <BranchPicker
        options={branches.map((branch) => ({ value: branch.id, label: getBranchLabel(branch) }))}
        onChange={(value) => value && navigate(`/branches/${value}/statistics`)}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {branches.map((branch) => (
          <Card key={branch.id} withBorder>
            <Stack gap="xs">
              <Text fw={600}>{getBranchLabel(branch)}</Text>
              <Anchor component={Link} to={`/branches/${branch.id}/statistics`}>
                Open branch
              </Anchor>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
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
  const [progressModal, setProgressModal] = useState<ProgressModal | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

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

  const dialogTitles: Record<string, string> = {
    codeSystems: 'FHIR CodeSystems',
    valueSets: 'FHIR ValueSets',
    changePaper: 'Change Paper',
    changePaperWithDataSet: 'Change Paper with Data Set Definitions',
    website: 'Data Dictionary Website'
  };

  const generate = async (type: string) => {
    if (!branchId) return;
    setPublishError(null);
    const title = dialogTitles[type] ?? type;
    const branchLabel = branch ? getBranchLabel(branch) : branchId;

    setProgressModal({
      title,
      message: `Generating ${title} for branch "${branchLabel}". This may take some time, please wait...`
    });

    try {
      let artifact: GeneratedArtifact;

      if (type === 'codeSystems') {
        artifact = await api.generateCodeSystems(branchId);
      } else if (type === 'valueSets') {
        artifact = await api.generateValueSets(branchId);
      } else if (type === 'changePaper') {
        artifact = await api.generateChangePaper(branchId, false);
      } else if (type === 'changePaperWithDataSet') {
        artifact = await api.generateChangePaper(branchId, true);
      } else {
        artifact = await api.generateWebsite(branchId);
      }

      downloadArtifact(artifact);
      notifications.show({
        color: 'green',
        title: `${title} generated`,
        message: `${title} generated successfully for branch "${branchLabel}".`
      });
    } catch {
      setPublishError(`Could not generate ${title} for this branch.`);
      notifications.show({
        color: 'red',
        title: 'Generation failed',
        message: `Could not generate ${title} for branch "${branchLabel}".`
      });
    } finally {
      setProgressModal(null);
    }
  };

  if (!branchId) {
    return <Alert color="yellow">No branch selected.</Alert>;
  }

  return (
    <Stack>
      <Modal
        opened={!!progressModal}
        onClose={() => {}}
        title={progressModal?.title}
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Stack gap="sm">
          <Text size="sm">{progressModal?.message}</Text>
          <Progress value={100} animated />
        </Stack>
      </Modal>

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
              Generate artefacts from the <strong>{branch ? getBranchLabel(branch) : branchId}</strong> branch.
            </Text>
            {publishError && <Alert color="red">{publishError}</Alert>}
            <Card withBorder>
              <Title order={4}>Terminology Server integration</Title>
              <Stack mt="sm">
                <Group justify="space-between">
                  <Text size="sm">Generate CodeSystem resource bundle (whole dictionary)</Text>
                  <Button onClick={() => generate('codeSystems')}>
                    Generate
                  </Button>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Generate ValueSet resource bundle (whole dictionary)</Text>
                  <Button onClick={() => generate('valueSets')}>
                    Generate
                  </Button>
                </Group>
              </Stack>
            </Card>
            <Card withBorder>
              <Title order={4}>DITA Outputs</Title>
              <Stack mt="sm">
                <Group justify="space-between">
                  <Text size="sm">Generate change paper</Text>
                  <Button onClick={() => generate('changePaper')}>
                    Generate
                  </Button>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Generate change paper (with Data Set definitions)</Text>
                  <Button onClick={() => generate('changePaperWithDataSet')}>
                    Generate
                  </Button>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Generate Data Dictionary website</Text>
                  <Button onClick={() => generate('website')}>
                    Generate
                  </Button>
                </Group>
              </Stack>
            </Card>
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

export function ChangesPage() {
  const api = useApi();
  const { branch: branchId } = useParams();
  const navigate = useNavigate();
  const { branches, loading, error } = useBranches();
  const [includeDataSets, setIncludeDataSets] = useState(false);
  const [running, setRunning] = useState(false);
  const [preview, setPreview] = useState<ChangePaperPreview | null>(null);

  const runPreview = () => {
    if (!branchId) return;
    setRunning(true);
    api
      .getChangePaperPreview(branchId, includeDataSets)
      .then(setPreview)
      .finally(() => setRunning(false));
  };

  if (loading) return <Loader />;

  return (
    <Stack>
      <Title order={2}>Change Paper Preview</Title>
      {error && <Alert color="red">{error}</Alert>}
      <Alert color="blue">
        This is a <strong>preview</strong> only. Some content may not exactly match the final published change paper.
      </Alert>
      <BranchPicker
        value={branchId ?? null}
        options={branches.map((branch) => ({ value: branch.id, label: getBranchLabel(branch) }))}
        onChange={(value) => navigate(value ? `/changes/${value}` : '/changes')}
      />

      {!branchId && (
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {branches.map((branch) => (
            <Card key={branch.id} withBorder>
              <Anchor component={Link} to={`/changes/${branch.id}`}>
                {getBranchLabel(branch)}
              </Anchor>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {branchId && (
        <Stack>
          <Group>
            <Checkbox
              checked={includeDataSets}
              onChange={(event) => setIncludeDataSets(event.currentTarget.checked)}
              label="Include data set definitions"
              disabled={running}
            />
            <Button onClick={runPreview} loading={running}>Run</Button>
            <Button variant="light" onClick={() => navigate('/changes')}>Change branch</Button>
          </Group>

          {preview?.background && (
            <Card withBorder>
              <Title order={3}>Background</Title>
              <Table mt="sm">
                <Table.Tbody>
                  {Object.entries(preview.background).map(([key, value]) => (
                    <Table.Tr key={key}>
                      <Table.Td style={{ width: '25%' }}>{key}</Table.Td>
                      <Table.Td>
                        <Box dangerouslySetInnerHTML={{ __html: value ?? '' }} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          )}

          {preview && (
            <Card withBorder>
              <Title order={3}>Summary of changes</Title>
              {preview.stereotypes.map((stereotype) => (
                <Box key={stereotype.name} mt="md">
                  <Title order={4}>{stereotype.name}</Title>
                  <Table mt="xs">
                    <Table.Tbody>
                      {stereotype.changes.map((change) => {
                        const anchor = ChangeAnchorId(stereotype.name, change.name);
                        return (
                          <Table.Tr key={anchor}>
                            <Table.Td style={{ width: '30%' }}>
                              <Anchor onClick={() => scrollToAnchor(anchor)}>{change.name}</Anchor>
                            </Table.Td>
                            <Table.Td>{change.summary}</Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </Box>
              ))}
            </Card>
          )}

          {preview && (
            <Card withBorder>
              <Title order={3}>Changes</Title>
              {preview.stereotypes.map((stereotype) => (
                <Box key={`detail-${stereotype.name}`} mt="md">
                  <Title order={4}>{stereotype.name}</Title>
                  {stereotype.changes.map((change) => {
                    const anchor = ChangeAnchorId(stereotype.name, change.name);
                    return (
                      <Paper key={anchor} withBorder p="sm" mt="sm" id={anchor}>
                        <Text fw={600} mb="xs">{change.name}</Text>
                        <Box dangerouslySetInnerHTML={{ __html: change.detail ?? '' }} />
                      </Paper>
                    );
                  })}
                </Box>
              ))}
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export function PreviewDefaultPage() {
  const { branches, loading } = useBranches();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  return (
    <Stack>
      <Title order={2}>Preview</Title>
      <Text>Select a branch to open the preview navigation.</Text>
      <Alert color="blue">
        This is a <strong>preview</strong> only. Some content may not exactly match the final published data dictionary.
      </Alert>
      <BranchPicker
        options={branches.map((branch) => ({ value: branch.id, label: getBranchLabel(branch) }))}
        onChange={(value) => value && navigate(`/preview/${value}`)}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {branches.map((branch) => (
          <Card key={branch.id} withBorder>
            <Anchor component={Link} to={`/preview/${branch.id}`}>
              {getBranchLabel(branch)}
            </Anchor>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export function PreviewHomePage() {
  const { branch: branchId } = useParams();

  if (!branchId) {
    return <Alert color="yellow">No branch selected.</Alert>;
  }

  return (
    <Stack>
      <Title order={2}>Welcome to the NHS Data Model and Dictionary for England.</Title>
      <Text>
        The NHS Data Model and Dictionary provides a reference point for approved Information Standards Notices.
      </Text>
      <Box ta="center">
        <img
          src="/images/4pics.gif"
          alt="NHS Data Dictionary images"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {previewTiles.map((tile) => (
          <Card withBorder key={tile.index}>
            <Stack gap="xs">
              <Text fw={600}>{tile.title}</Text>
              <Text size="sm">{tile.description}</Text>
              <Anchor
                component={Link}
                to={
                  tile.index === 'dataSetFolder'
                    ? `/preview/${branchId}/dataSetFolder/root`
                    : `/preview/${branchId}/${tile.index}`
                }
              >
                {tile.index === 'dataSetFolder' ? 'Open root folder' : 'Open index'}
              </Anchor>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
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
    <Stack>
      <PreviewBreadcrumb
        items={[
          { label: 'Preview', to: `/preview/${branchId}` },
          { label: indexTitleMap[normalizedIndex] ?? normalizedIndex }
        ]}
      />
      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Stack>
            <Title order={2}>{indexTitleMap[normalizedIndex] ?? normalizedIndex}</Title>
            <Alert color="blue">
              For preview only, this index page does not include the final published description block.
            </Alert>
            {groups.map(([key, groupItems]) => (
              <PreviewSection key={key} title={key}>
                <Table>
                  <Table.Tbody>
                    {groupItems.map((item) => (
                      <Table.Tr key={resolvePreviewItemId(item) || item.name}>
                        <Table.Td>
                          {resolvePreviewItemId(item) ? (
                            <Anchor
                              component={Link}
                              to={`/preview/${branchId}/${mapLinkIndex(item.stereotype)}/${resolvePreviewItemId(item)}`}
                            >
                              {item.name}
                            </Anchor>
                          ) : (
                            <Text>{item.name}</Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </PreviewSection>
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <PreviewToc links={tocLinks} onNavigate={scrollToAnchor} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function PreviewDetailPage() {
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
     <List spacing="xs">
       {items.map((item) => (
         <List.Item key={resolvePreviewItemId(item) || item.name}>
           {resolvePreviewItemId(item) ? (
             <Anchor
               component={Link}
               to={`/preview/${branchId}/${mapLinkIndex(item.stereotype)}/${resolvePreviewItemId(item)}`}
             >
               {item.name}
             </Anchor>
           ) : (
             <Text>{item.name}</Text>
           )}
         </List.Item>
       ))}
     </List>
   );

  return (
    <Stack>
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

      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Stack>
            <Title order={1}>{detail.name}</Title>
            {detail.shortDescription && (
              <Text dangerouslySetInnerHTML={{ __html: detail.shortDescription }} />
            )}

            {detail.formatLength && (
              <PreviewSection title="Format / Length">
                <Text dangerouslySetInnerHTML={{ __html: detail.formatLength }} />
              </PreviewSection>
            )}

            {detail.description && (
              <PreviewSection title="Description">
                {detail.attributeText && (
                  <Text mb="xs" dangerouslySetInnerHTML={{ __html: detail.attributeText }} />
                )}
                <Text dangerouslySetInnerHTML={{ __html: detail.description }} />
              </PreviewSection>
            )}

            {detail.nationalCodes && detail.nationalCodes.length > 0 && (
              <PreviewSection title="National Codes">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
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
                </Table>
              </PreviewSection>
            )}

            {detail.defaultCodes && detail.defaultCodes.length > 0 && (
              <PreviewSection title="Default Codes">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
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
                </Table>
              </PreviewSection>
            )}

            {detail.definition && (
              <PreviewSection title="Specification">
                <Box dangerouslySetInnerHTML={{ __html: detail.definition }} />
              </PreviewSection>
            )}

            {detail.attributes && detail.attributes.length > 0 && (
              detail.stereotype === 'class' ? (
                <PreviewSection title="Attributes">
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
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
                                 component={Link}
                                 to={`/preview/${branchId}/${mapLinkIndex(item.stereotype)}/${resolvePreviewItemId(item)}`}
                               >
                                 {item.name}
                               </Anchor>
                             ) : (
                               <Text>{item.name}</Text>
                             )}
                           </Table.Td>
                         </Table.Tr>
                       ))}
                    </Table.Tbody>
                  </Table>
                </PreviewSection>
              ) : (
                <PreviewSection title="Attributes">{renderLinkList(detail.attributes)}</PreviewSection>
              )
            )}

            {detail.relationships && detail.relationships.length > 0 && (
              <PreviewSection title="Relationships">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
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
                              component={Link}
                              to={`/preview/${branchId}/${mapLinkIndex(relationship.stereotype)}/${resolvePreviewItemId(relationship)}`}
                            >
                              {relationship.name}
                            </Anchor>
                          ) : (
                            <Text>{relationship.name}</Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
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
                <Table>
                  <Table.Thead>
                    <Table.Tr>
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
                </Table>
              </PreviewSection>
            )}

            {showWhereUsed && (
              <PreviewSection title="Where Used">
                <Group mb="sm">
                  <Button variant="light" onClick={loadReferences} loading={loadingRefs}>
                    Load references
                  </Button>
                </Group>
                {references.length > 0 && (
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Link</Table.Th>
                        <Table.Th>How used</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                       {references.map((reference, idx) => (
                         <Table.Tr key={resolvePreviewItemId(reference) || idx}>
                           <Table.Td>{reference.stereotype ?? '-'}</Table.Td>
                           <Table.Td>
                             {resolvePreviewItemId(reference) ? (
                               <Anchor
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
                  </Table>
                )}
              </PreviewSection>
            )}

            {detail.dataElements && detail.dataElements.length > 0 && (
              <PreviewSection title="Data Elements">{renderLinkList(detail.dataElements)}</PreviewSection>
            )}

            <PreviewSection title="Change Log">
              {detail.changeLog?.headerText && (
                <Box mb="sm" dangerouslySetInnerHTML={{ __html: detail.changeLog.headerText }} />
              )}
              {detail.changeLog?.entries && detail.changeLog.entries.length > 0 && (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
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
                </Table>
              )}
              {detail.changeLog?.footerText && (
                <Box mt="sm" dangerouslySetInnerHTML={{ __html: detail.changeLog.footerText }} />
              )}
            </PreviewSection>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <PreviewToc links={tocLinks} onNavigate={scrollToAnchor} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

































