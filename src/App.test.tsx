import { render } from '@testing-library/react';
import { describe, test } from 'vitest';
import { App } from './App';

describe('App', () => {
  test('it renders the App component', () => {
    render(<App />);
  });
});
