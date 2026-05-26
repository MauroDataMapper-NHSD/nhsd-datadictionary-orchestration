/**
 * Shared utilities and helpers for preview and page components
 */

export type PreviewIndexItem = {
  catalogueId?: string;
  id?: string;
  name: string;
  stereotype: string;
  isRetired: boolean;
};

export const previewEndpointMap: Record<string, string> = {
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

export const previewRouteIndexAliases: Record<string, string> = {
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

export const stereotypeToRouteIndex: Record<string, string> = {
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

export const indexTitleMap: Record<string, string> = {
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

export const previewTiles = [
  {
    index: 'dataSetFolder',
    title: 'Data Sets',
    description: 'Data Sets provide the specification for data collections and for data analyses.'
  },
  {
    index: 'element',
    title: 'Data Elements',
    description: 'Data Elements are the data items used within Data Sets.'
  },
  {
    index: 'attribute',
    title: 'Attributes',
    description:
      'The part of the data model describing the characteristics of Classes. Attributes define the data within the data model.'
  },
  {
    index: 'class',
    title: 'Classes',
    description:
      'The part of the data model describing the aspects of the health and care business with significant characteristics.'
  },
  {
    index: 'businessDefinition',
    title: 'NHS Business Definitions',
    description:
      'The part of the data model that links the logical classes to the context of the health and care business.'
  },
  {
    index: 'supportingInformation',
    title: 'Supporting Information',
    description: 'Provide information to help users understand content in the NHS Data Model and Dictionary.'
  },
  {
    index: 'dataSetConstraint',
    title: 'Data Set Constraints',
    description: ''
  },
  {
    index: 'allItemsIndex',
    title: 'All Items Index',
    description: 'Lists all items in the dictionary alphabetically.'
  }
];

export const previewTypeLabelMap: Record<string, string> = {
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

export function sectionId(label: string) {
  return `section-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export function normalizePreviewRouteIndex(value: string | undefined): string | undefined {
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

export function resolvePreviewEndpoint(index: string | undefined): string | undefined {
  const routeIndex = normalizePreviewRouteIndex(index);
  if (!routeIndex) {
    return undefined;
  }

  return previewEndpointMap[routeIndex];
}

export function normalizePreviewItemId(value: unknown) {
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

export function resolvePreviewItemId(item: Record<string, unknown>) {
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

export function getPreviewItemClassName(item: {
  stereotype?: string;
  isRetired?: boolean;
  retired?: boolean;
}) {
  return [item.stereotype, item.isRetired || item.retired ? 'retired' : undefined]
    .filter(Boolean)
    .join(' ');
}

export function prettifyPreviewStereotype(stereotype: string | undefined) {
  if (!stereotype) {
    return '-';
  }

  const normalized = normalizePreviewRouteIndex(stereotype);
  return (normalized && previewTypeLabelMap[normalized]) ?? stereotype;
}

export function scrollToAnchor(anchor: string) {
  const element = document.getElementById(anchor);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

