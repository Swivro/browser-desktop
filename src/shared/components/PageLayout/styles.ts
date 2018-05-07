import styled from 'styled-components';
import pages from '../../defaults/pages';

export const StyledPageLayout = styled.div`
  width: 100%;
  height: 100vh;
`;

export const Content = styled.div`
  width: calc(100% - ${pages.navDrawerWidth}px);
  height: calc(100% - ${pages.toolbarHeight}px);
  top: ${pages.toolbarHeight}px;
  left: ${pages.navDrawerWidth}px;
  position: relative;
  overflow: auto;
  z-index: 10;
`;
