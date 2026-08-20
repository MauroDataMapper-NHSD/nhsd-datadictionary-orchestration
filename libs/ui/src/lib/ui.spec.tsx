import { fireEvent, render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

import { BranchPicker, FeaturePage } from './ui';

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

  it('should show icons for branch and finalised version options', () => {
    render(
      <MantineProvider>
        <BranchPicker
          label='Current branch'
          value='release-2026'
          options={[
            { value: 'release-2026', label: '2026.1', icon: 'version' },
            { value: 'feature-branch', label: 'feature/preview-icons', icon: 'branch' }
          ]}
          onChange={() => undefined}
        />
      </MantineProvider>
    );

    expect(screen.getByTestId('branch-picker-selected-icon-version')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Current branch'));

    expect(screen.getAllByTestId('branch-picker-option-icon-version')).toHaveLength(1);
    expect(screen.getAllByTestId('branch-picker-option-icon-branch')).toHaveLength(1);
  });

  it('should group branch options before finalised releases', () => {
    render(
      <MantineProvider>
        <BranchPicker
          label='Current branch'
          options={[
            { value: 'release-2026', label: '2026.1', icon: 'version' },
            { value: 'feature-zeta', label: 'zeta', icon: 'branch' },
            { value: 'feature-alpha', label: 'alpha', icon: 'branch' }
          ]}
          onChange={() => undefined}
        />
      </MantineProvider>
    );

    fireEvent.click(screen.getByLabelText('Current branch'));

    const dropdownText = screen.getByRole('listbox').textContent ?? '';
    expect(dropdownText.indexOf('In-progress branches')).toBeLessThan(dropdownText.indexOf('Finalised releases'));
    expect(dropdownText.indexOf('alpha')).toBeLessThan(dropdownText.indexOf('zeta'));
    expect(dropdownText.indexOf('zeta')).toBeLessThan(dropdownText.indexOf('2026.1'));
  });
});
