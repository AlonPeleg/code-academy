import { createStore } from './store';
import type { RemoteSettings } from '../runners/types';

export type Lang = 'en' | 'he';

export interface Settings {
  remote: RemoteSettings;
  /** Language of the interface and (when a translation exists) of the lessons */
  lang: Lang;
}

export const DEFAULT_REMOTE: RemoteSettings = {
  provider: 'judge0',
  baseUrl: 'https://ce.judge0.com',
  headerName: '',
  headerValue: '',
};

export const settingsStore = createStore<Settings>('codeacademy:settings', { remote: DEFAULT_REMOTE, lang: 'en' });
