import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyButton } from '../CopyButton';

vi.mock('@/lib/toast', () => ({
  default: () => ({
    create: vi.fn(),
  }),
}));

describe('CopyButton component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders copy button and copies content to clipboard on click', () => {
    render(<CopyButton content="test-copy-token" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-copy-token');
  });
});
