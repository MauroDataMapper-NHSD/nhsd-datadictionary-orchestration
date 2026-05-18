import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

import { FeaturePage } from './ui';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  })
});

describe('Ui', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MantineProvider>
        <FeaturePage title="Branches" description="Branch management overview" />
      </MantineProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
