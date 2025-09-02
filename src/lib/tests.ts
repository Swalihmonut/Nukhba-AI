import { cn } from '../lib/utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional class names', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });
});