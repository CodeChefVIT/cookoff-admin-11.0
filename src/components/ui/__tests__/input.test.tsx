import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../input';

describe('Input component', () => {
  it('renders input with placeholder and value', () => {
    render(<Input placeholder="Enter username" defaultValue="admin" />);
    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('admin');
  });

  it('triggers onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Search" onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies disabled state properly', () => {
    render(<Input placeholder="Disabled" disabled />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });
});
