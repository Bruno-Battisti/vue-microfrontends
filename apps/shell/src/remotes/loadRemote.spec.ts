import { describe, it, expect } from 'vitest';
import { loadRemoteComponent } from './loadRemote';

describe('loadRemoteComponent', () => {
  it('throws for an unregistered remote name', () => {
    expect(() => loadRemoteComponent('unknown', 'Desconhecido')).toThrowError(/Remote desconhecido/);
  });

  it('returns an async component for a registered remote', () => {
    const component = loadRemoteComponent('dashboard', 'Dashboard');
    expect(component).toBeTruthy();
  });
});
