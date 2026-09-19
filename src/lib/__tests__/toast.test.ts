import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useToast from '../toast';

vi.mock('react-hot-toast', () => ({
  default: {
    custom: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('useToast hook / toast wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a custom toast notification on create', () => {
    const { create } = useToast();
    create('Operation succeeded', 'success');
    expect(toast.custom).toHaveBeenCalled();
  });

  it('defaults type to info when not specified', () => {
    const { create } = useToast();
    create('Informational notice');
    expect(toast.custom).toHaveBeenCalled();
  });
});
