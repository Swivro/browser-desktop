import { observer } from 'mobx-react';
import { resolve } from 'path';
import React from 'react';
import StyledPage from './styles';
import Page from '../../models/page';
import Tab from '../../models/tab';
import Store from '../../store';
import { addFavicon, history } from '../../utils/storage';

interface Props {
  page: Page;
  selected: boolean;
}

@observer
export default class extends React.Component<Props, {}> {
  private lastURL = '';
  private lastHistoryItemID = -1;

  private webview: Electron.WebviewTag;
  private tab: Tab;

  public componentDidMount() {
    const { id } = this.props.page;
    const tab = Store.getTabById(id);
    this.tab = tab;

    this.webview.addEventListener('did-stop-loading', this.onDidStopLoading);
    this.webview.addEventListener('did-navigate', this.onNavigate);
    this.webview.addEventListener('did-navigate-in-page', this.onNavigate);
    this.webview.addEventListener('will-navigate', this.onNavigate);
    this.webview.addEventListener('page-title-updated', this.onPageTitleUpdated);
    this.webview.addEventListener('load-commit', this.onLoadCommit);
    this.webview.addEventListener('page-favicon-updated', this.onPageFaviconUpdated);
    this.webview.addEventListener('dom-ready', this.onDomReady);
  }

  public componentWillUnmount() {
    this.webview.removeEventListener('did-stop-loading', this.onDidStopLoading);
    this.webview.removeEventListener('did-navigate', this.onNavigate);
    this.webview.removeEventListener('did-navigate-in-page', this.onNavigate);
    this.webview.removeEventListener('will-navigate', this.onNavigate);
    this.webview.removeEventListener('page-title-updated', this.onPageTitleUpdated);
    this.webview.removeEventListener('load-commit', this.onLoadCommit);
    this.webview.removeEventListener('page-favicon-updated', this.onPageFaviconUpdated);
  }

  public onContextMenu = (e: Electron.Event, params: Electron.ContextMenuParams) => {
    requestAnimationFrame(() => {
      Store.pageMenu.toggle(true);
    });

    Store.contextMenuParams = params;

    // Calculate new menu position
    // using cursor x, y and
    // width, height of the menu.
    const x = Store.mouse.x;
    const y = Store.mouse.y;

    // By default it opens menu from upper left corner.
    let left = x;
    let top = y;

    const width = 3 * 64;
    const height = Store.pageMenu.getHeight();

    // Open menu from right corner.
    if (left + width > window.innerWidth) {
      left = x - width;
    }

    // Open menu from bottom corner.
    if (top + height > window.innerHeight) {
      top = y - height;
    }

    if (top < 0) {
      top = 96;
    }

    // Set the new position.
    Store.pageMenuData.x = left;
    Store.pageMenuData.y = top;
  };

  public onDomReady = () => {
    this.webview.getWebContents().on('context-menu', this.onContextMenu);
    this.webview.removeEventListener('dom-ready', this.onDomReady);
  };

  public onDidStopLoading = (e: Electron.Event) => {
    this.onNavigate(e as any);
    this.tab.loading = false;
  };

  public onNavigate = ({ isMainFrame, url }: any) => {
    Store.refreshNavigationState();

    if (!isMainFrame && !url) return;
    this.tab.url = url;
    this.updateData();
  };

  public onLoadCommit = ({ url, isMainFrame }: Electron.LoadCommitEvent) => {
    this.tab.loading = true;

    if (url !== this.lastURL && isMainFrame && !url.startsWith('wexond://')) {
      const self = this;
      history.run(
        "INSERT INTO history(title, url, favicon, date) VALUES (?, ?, ?, DATETIME('now', 'localtime'))",
        [this.tab.title, url, this.tab.favicon],
        function callback() {
          self.lastHistoryItemID = this.lastID;
        },
      );
      this.lastURL = url;
    }
  };

  public onPageFaviconUpdated = ({ favicons }: Electron.PageFaviconUpdatedEvent) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = async () => {
      if (request.readyState === 4) {
        if (request.status === 404) {
          this.tab.favicon = '';
        } else {
          this.tab.favicon = favicons[0];
          addFavicon(favicons[0]);
        }
      }
      this.updateData();
    };

    request.open('GET', favicons[0], true);
    request.send(null);
  };

  public updateData = () => {
    if (this.lastURL === this.tab.url) {
      if (this.lastHistoryItemID !== -1) {
        const query = 'UPDATE history SET title = ?, url = ?, favicon = ? WHERE rowid = ?';
        const data = [
          this.tab.title,
          this.webview.getURL(),
          this.tab.favicon,
          this.lastHistoryItemID,
        ];
        history.run(query, data);
      }
    }
  };

  public onPageTitleUpdated = ({ title }: Electron.PageTitleUpdatedEvent) => {
    const { id } = this.props.page;
    const tab = Store.getTabById(id);

    tab.title = title;
    this.updateData();
  };

  public render() {
    const { page, selected } = this.props;
    const { url } = page;

    return (
      <StyledPage selected={selected}>
        <webview
          src={url}
          style={{ height: '100%' }}
          ref={(r: Electron.WebviewTag) => {
            page.webview = r;
            this.webview = r;
          }}
          preload={`file://${resolve(Store.basePath, 'src/app/preloads/index.js')}`}
        />
      </StyledPage>
    );
  }
}
