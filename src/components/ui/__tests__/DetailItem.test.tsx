import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ModalDetailText from '../DetailItem';

vi.mock('@/lib/toast', () => ({
  default: () => ({
    create: vi.fn(),
  }),
}));

describe('ModalDetailText component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders label and content', () => {
    render(<ModalDetailText label="User ID:" content="12345" />);
    expect(screen.getByText('User ID:')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('allows copying content when copyable is true', () => {
    render(<ModalDetailText label="API Key:" content="secret-key" copyable />);
    const copyIcon = document.querySelector('svg');
    expect(copyIcon).toBeInTheDocument();
    if (copyIcon) {
      fireEvent.click(copyIcon);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('secret-key');
    }
  });
});
