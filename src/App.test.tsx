// import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { render, screen } from './test-utils';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/0/i);
  expect(linkElement).toBeInTheDocument();
});
