import { createStore } from './store';
import type { RemoteSettings } from '../runners/types';

export interface Settings {
  remote: RemoteSettings;
}

export const DEFAULT_REMOTE: RemoteSettings = {
  provider: 'judge0',
  baseUrl: 'https://ce.judge0.com',
  headerName: '',
  headerValue: '',
};

export const settingsStore = createStore<Settings>('codeacademy:settings', { remote: DEFAULT_REMOTE });
