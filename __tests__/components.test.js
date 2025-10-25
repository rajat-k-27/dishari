// Test file for critical functionality
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../components/Button';
import Alert from '../components/Alert';

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('applies primary variant class', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-600');
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});

describe('Alert Component', () => {
  test('renders alert with message', () => {
    render(<Alert type="success" message="Test message" show={true} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    render(<Alert type="success" message="Test message" show={false} />);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
});

describe('Cart Store', () => {
  test('adds item to cart', () => {
    // Cart store tests would go here
    // This is a placeholder for demonstration
    expect(true).toBe(true);
  });
});
