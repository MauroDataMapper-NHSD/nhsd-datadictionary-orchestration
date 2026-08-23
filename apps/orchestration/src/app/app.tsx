import { notifications } from '@mantine/notifications';
import { saveAs } from 'file-saver';
import { clearUserSession, getOpenIdConnectRedirectUri, persistUserSession } from './auth';
import { OpenIdConnectCallbackPage } from './openid-connect-callback';
import {
  BusinessDefinitionEditData,
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
import styles from './app.module.scss';
import { BranchSummary, MauroModule, MauroStatus, OrchestrationApiClient } from 'api-client';
import { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { BranchesContext } from './branches-context';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Checkbox, Select, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import {
  AppLayout,
  BranchPickerOption,
  HtmlEditor,
  PageDialog,
  PageOption,
  PublishMenuAction,
  OpenIdConnectProvider
} from 'ui';

const appVersion = import .meta.env.VITE_APP_VERSION ?? '1.0.0';
const mauroBaseUrl = import .meta.env.VITE_MAURO_BASE_URL ?? API_CONFIG.DEFAULT_BASE_URL;

const apiClient = new OrchestrationApiClient({ baseUrl: mauroBaseUrl });

function getBranchLabel(branch: BranchSummary): string {
  return branch.modelVersionTag ?? branch.branchName ?? branch.name ?? branch.id ?? 'Unnamed branch';
}

function getBranchPickerOption(branch: BranchSummary): BranchPickerOption {
  return {
    value: branch.id,
    label: getBranchLabel(branch),
    icon: branch.modelVersionTag ? 'version' : 'branch'
  };
}

function BusinessDefinitionEditForm({
  value,
  onChange
}: {
  value: BusinessDefinitionEditData;
  onChange: (next: BusinessDefinitionEditData) => void;
}): ReactElement {
  const statusOptions: Array<BusinessDefinitionEditData['status']> = [
    'Preparatory',
    'Live',
    'Retired'
  ];

  return (
    <Stack gap="md">
      <Box className={styles.editSection}>
        <Title order={4} className={styles.editSectionHeader}>
          Publication Status
        </Title>
        <Table className={styles.editSectionTable} withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td w="220" fw={600}>
                Status
              </Table.Td>
              <Table.Td>
                <Box maw={280}>
                  <Select
                    data={statusOptions}
                    value={value.status}
                    allowDeselect={false}
                    onChange={(status) =>
                      status &&
                      onChange({
                        ...value,
                        status: status as BusinessDefinitionEditData['status'],
                        retiredDate: status === 'Retired' ? value.retiredDate : ''
                      })
                    }
                  />
                </Box>
              </Table.Td>
            </Table.Tr>
            {value.status === 'Retired' && (
              <Table.Tr>
                <Table.Td fw={600}>Retired Date</Table.Td>
                <Table.Td>
                  <Box maw={420}>
                    <TextInput
                      maxLength={50}
                      value={value.retiredDate}
                      onChange={(event) => onChange({ ...value, retiredDate: event.currentTarget.value })}
                    />
                  </Box>
                </Table.Td>
              </Table.Tr>
            )}
            <Table.Tr>
              <Table.Td fw={600}>Valid From</Table.Td>
              <Table.Td>
                <Box maw={420}>
                  <TextInput
                    maxLength={50}
                    value={value.validFrom}
                    onChange={(event) => onChange({ ...value, validFrom: event.currentTarget.value })}
                  />
                </Box>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td fw={600}>Valid To</Table.Td>
              <Table.Td>
                <Box maw={420}>
                  <TextInput
                    maxLength={50}
                    value={value.validTo}
                    onChange={(event) => onChange({ ...value, validTo: event.currentTarget.value })}
                  />
                </Box>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>

      <Box className={styles.editSection}>
        <Title order={4} className={styles.editSectionHeader}>
          Descriptions
        </Title>
        <Table className={styles.editSectionTable} withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td w='220' fw={600}>
                Short Description
              </Table.Td>
              <Table.Td>
                <Stack gap='xs' maw={720}>
                  <Checkbox
                    label='Default short description'
                    checked={value.defaultShortDescription}
                    onChange={(event) =>
                      onChange({
                        ...value,
                        defaultShortDescription: event.currentTarget.checked
                      })
                    }
                  />
                  {value.defaultShortDescription ? (
                    <Text c='dimmed'>
                      Default short description will be generated automatically when available.
                    </Text>
                  ) : (
                    <Box maw={720}>
                      <TextInput
                        maxLength={100}
                        value={value.shortDescription}
                        onChange={(event) =>
                          onChange({
                            ...value,
                            shortDescription: event.currentTarget.value
                          })
                        }
                      />
                    </Box>
                  )}
                </Stack>
              </Table.Td>
            </Table.Tr>
             <Table.Tr>
               <Table.Td w="220" fw={600}>
                 Description
               </Table.Td>
               <Table.Td>
                <HtmlEditor
                  value={value.description}
                  onChange={(description) => onChange({ ...value, description })}
                />
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>

      <Box className={styles.editSection}>
        <Title order={4} className={styles.editSectionHeader}>
          Naming
        </Title>
        <Table className={styles.editSectionTable} withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td w="220" fw={600}>
                Name
              </Table.Td>
              <Table.Td>
                <Text>{value.name}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td w="220" fw={600}>Title Case Name</Table.Td>
              <Table.Td>
                <Box maw={420}>
                  <TextInput
                    maxLength={50}
                    value={value.titleCaseName}
                    onChange={(event) => onChange({ ...value, titleCaseName: event.currentTarget.value })}
                  />
                </Box>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td fw={600}>Website Page Heading</Table.Td>
              <Table.Td>
                <Box maw={420}>
                  <TextInput
                    maxLength={50}
                    value={value.websitePageHeading}
                    onChange={(event) =>
                      onChange({ ...value, websitePageHeading: event.currentTarget.value })
                    }
                  />
                </Box>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>

      <Box className={styles.editSection}>
        <Title order={4} className={styles.editSectionHeader}>
          Aliases
        </Title>
        <Table className={styles.editSectionTable} withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td w="220" fw={600}>No aliases required</Table.Td>
              <Table.Td>
                <Checkbox
                  label='No aliases required'
                  checked={value.noAliasesRequired}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      noAliasesRequired: event.currentTarget.checked
                    })
                  }
                />
              </Table.Td>
            </Table.Tr>
            {!value.noAliasesRequired && (
              <>
                <Table.Tr>
                  <Table.Td fw={600}>Short Name</Table.Td>
                  <Table.Td>
                    <Box maw={420}>
                      <TextInput
                        maxLength={50}
                        value={value.shortName}
                        onChange={(event) => onChange({ ...value, shortName: event.currentTarget.value })}
                      />
                    </Box>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td w="220" fw={600}>Also known as</Table.Td>
                  <Table.Td>
                    <Box maw={420}>
                      <TextInput
                        maxLength={50}
                        value={value.alsoKnownAs}
                        onChange={(event) => onChange({ ...value, alsoKnownAs: event.currentTarget.value })}
                      />
                    </Box>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>Plural</Table.Td>
                  <Table.Td>
                    <Box maw={420}>
                      <TextInput
                        maxLength={50}
                        value={value.plural}
                        onChange={(event) => onChange({ ...value, plural: event.currentTarget.value })}
                      />
                    </Box>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td w="220" fw={600}>Formerly</Table.Td>
                  <Table.Td>
                    <Box maw={420}>
                      <TextInput
                        maxLength={50}
                        value={value.formerly}
                        onChange={(event) => onChange({ ...value, formerly: event.currentTarget.value })}
                      />
                    </Box>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>Full Name</Table.Td>
                  <Table.Td>
                    <Box maw={420}>
                      <TextInput
                        maxLength={50}
                        value={value.fullName}
                        onChange={(event) => onChange({ ...value, fullName: event.currentTarget.value })}
                      />
                    </Box>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>Index Name</Table.Td>
                  <Table.Td>
                    <Box maw={420}>
                      <TextInput
                        maxLength={50}
                        value={value.indexName}
                        onChange={(event) => onChange({ ...value, indexName: event.currentTarget.value })}
                      />
                    </Box>
                  </Table.Td>
                </Table.Tr>
              </>
            )}
          </Table.Tbody>
        </Table>
      </Box>
    </Stack>
  );
}

export function App(): ReactElement {
  const [openIdConnectProviders, setOpenIdConnectProviders] = useState<OpenIdConnectProvider[]>([]);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [pageOptions, setPageOptions] = useState<PageOption[]>([]);
  const [editDialogOpened, setEditDialogOpened] = useState(false);
  const [editDialogTitle, setEditDialogTitle] = useState<ReactNode>('Edit page');
  const [businessDefinitionEditData, setBusinessDefinitionEditData] =
    useState<BusinessDefinitionEditData | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.SELECTED_BRANCH_ID)
  );
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

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const items = await apiClient.getBranches();
        setBranches(items);
      } catch {
        setBranches([]);
        setBranchesError('Could not load branches.');
      } finally {
        setBranchesLoading(false);
      }
    };

    loadBranches();
  }, []);

  const handleSignOut = async () => {
    clearUserSession();
    localStorage.removeItem(STORAGE_KEYS.SELECTED_BRANCH_ID);
    setSelectedBranchId(null);
    setPageOptions([]);

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

  const handleOpenIdConnect = async (provider: OpenIdConnectProvider) => {
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
    setPageOptions([]);

    navigate(`${ROUTES.PREVIEW}/${branchId}`);
  };

  const handlePageOptionsChange = useCallback((options: PageOption[]) => {
    setPageOptions(options);
  }, []);

  const handleEditBusinessDefinition = useCallback((data: BusinessDefinitionEditData) => {
    setEditDialogTitle(
      <span>
        Edit{' '}
        <span className={data.titleClassName || data.stereotypeForPreview} data-role='edit-dialog-item-name'>
          {data.name}
        </span>
      </span>
    );
    setBusinessDefinitionEditData(data);
    setEditDialogOpened(true);
  }, []);

  const handleSaveEditDialog = async () => {
    // Save wiring will be added once backend edit endpoint is available.
    setEditDialogOpened(false);
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
    const found = branches.find((branch) => branch.id === branchId);
    const branchLabel = found ? getBranchLabel(found) : branchId;

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

  return (
    <BranchesContext.Provider value={{ branches, loading: branchesLoading, error: branchesError }}>
    <>
    <AppLayout
      appTitle="Data Dictionary Orchestrator"
      version={appVersion}
      links={[]}
      pageOptions={pageOptions}
      branchOptions={branches.map(getBranchPickerOption)}
      selectedBranchId={selectedBranchId}
      onBranchChange={handleBranchChange}
      onLoadStatistics={handleLoadStatistics}
      onLoadIntegrityChecks={handleLoadIntegrityChecks}
      onRunChangePaperPreview={handleRunChangePaperPreview}
      onGeneratePublish={handleGeneratePublish}
      onLoadAbout={handleLoadAbout}
      signInHref={mauroBaseUrl}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
      onOpenIdConnect={handleOpenIdConnect}
      openIdConnectProviders={openIdConnectProviders}
      mauroBaseUrl={mauroBaseUrl}
    >
      <Routes>
        <Route path={ROUTES.AUTH_CALLBACK} element={<OpenIdConnectCallbackPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path={ROUTES.PREVIEW} element={<PreviewDefaultPage />} />
        <Route path={`${ROUTES.PREVIEW}/:branch`} element={<PreviewHomePage />} />
        <Route path={`${ROUTES.PREVIEW}/:branch/:index`} element={<PreviewIndexPage />} />
        <Route
          path={`${ROUTES.PREVIEW}/:branch/:index/:id`}
          element={
            <PreviewDetailPage
              onPageOptionsChange={handlePageOptionsChange}
              onEditBusinessDefinition={handleEditBusinessDefinition}
            />
          }
        />
        <Route path={ROUTES.NOT_AUTHORIZED} element={<ErrorStatePage variant="not-authorized" />} />
        <Route path={ROUTES.NOT_FOUND} element={<ErrorStatePage variant="not-found" />} />
        <Route path={ROUTES.NOT_IMPLEMENTED} element={<ErrorStatePage variant="not-implemented" />} />
        <Route path={ROUTES.SERVER_ERROR} element={<ErrorStatePage variant="server-error" />} />
        <Route path="*" element={<ErrorStatePage variant="not-found" />} />
      </Routes>
    </AppLayout>
      <PageDialog
        opened={editDialogOpened}
        title={editDialogTitle}
        onClose={() => setEditDialogOpened(false)}
        onSave={handleSaveEditDialog}
      >
        {businessDefinitionEditData ? (
          <BusinessDefinitionEditForm
            value={businessDefinitionEditData}
            onChange={setBusinessDefinitionEditData}
          />
        ) : (
          <Text c="dimmed">No Business Definition selected for editing.</Text>
        )}
      </PageDialog>
    </>
    </BranchesContext.Provider>
  );
}

export default App;
