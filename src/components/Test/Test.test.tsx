import { render, screen } from '../../test-utils';
import Test from './Test';

it('It should mount', () => {
  render(<Test />);
  const linkElement = screen.getByText(/0/i);
  expect(linkElement).toBeInTheDocument();
});