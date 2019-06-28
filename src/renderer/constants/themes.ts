import { Theme } from '../app/models/theme';
import { transparency } from './transparency';
import { colors } from './colors';

export const lightTheme: Theme = {
  'toolbar.backgroundColor': '#fff',
  'toolbar.overlay.backgroundColor': '#e5e8ea',
  'toolbar.bottomLine.backgroundColor': 'rgba(0, 0, 0, 0.12)',
  'toolbar.icons.invert': false,
  'toolbar.separator.color': 'rgba(0, 0, 0, 0.12)',
  'tab.backgroundOpacity': 0.85,
  'tab.selectedHover.backgroundOpacity': 0.8,
  'tab.hover.backgroundColor': 'rgba(0, 0, 0, 0.04)',
  'tab.selected.textColor': 'inherit',
  'tab.textColor': `rgba(0, 0, 0, ${transparency.text.high})`,
  'tab.allowLightBackground': false,
  'overlay.windowsButtons.invert': false,
  'overlay.section.backgroundColor': '#ECEFF1',
  'overlay.dialog.backgroundColor': '#fff',
  'overlay.foreground': 'dark',
  'overlay.backgroundColor': '#fff',
  'overlay.separator.color': 'rgba(0, 0, 0, 0.12)',
  'overlay.scrollbar.backgroundColor': 'rgba(0, 0, 0, 0.16)',
  'overlay.scrollbar.hover.backgroundColor': 'rgba(0, 0, 0, 0.32)',
  accentColor: colors.blue['500'],
};

export const darkTheme: Theme = {
  'toolbar.backgroundColor': '#1c1c1c',
  'toolbar.overlay.backgroundColor': '#414141',
  'toolbar.bottomLine.backgroundColor': '#000',
  'toolbar.icons.invert': true,
  'toolbar.separator.color': 'rgba(255, 255, 255, 0.12)',
  'tab.backgroundOpacity': 0.6,
  'tab.selectedHover.backgroundOpacity': 0.45,
  'tab.hover.backgroundColor': 'rgba(255, 255, 255, 0.12)',
  'tab.selected.textColor': '#fff',
  'tab.textColor': 'rgba(255, 255, 255, 0.54)',
  'tab.allowLightBackground': true,
  'overlay.windowsButtons.invert': true,
  'overlay.backgroundColor': '#1c1c1c',
  'overlay.section.backgroundColor': 'rgba(255, 255, 255, 0.12)',
  'overlay.dialog.backgroundColor': '#303030',
  'overlay.foreground': 'light',
  'overlay.separator.color': 'rgba(255, 255, 255, 0.12)',
  'overlay.scrollbar.backgroundColor': 'rgba(255, 255, 255, 0.16)',
  'overlay.scrollbar.hover.backgroundColor': 'rgba(255, 255, 255, 0.48)',
  accentColor: colors.blue['500'],
};
