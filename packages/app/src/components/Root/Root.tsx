import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MapIcon from '@material-ui/icons/MyLocation';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Light from '@material-ui/icons/BubbleChart';
import Power from '@material-ui/icons/Power';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import zenithLogo from '../../Bstage-componets/icons/zenith_logo.png';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Sidebar,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  sidebarConfig,
} from '../../Bstage-componets';
import { useUserProfile } from '../../apiUtils/useUserProfileInfo';
import {
  errorApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const styles = {
  googleIcon: {
    width: '140px',
    height: '30px',
    margin: '40px',
  },
};

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();

  return (
    <div className={classes.root}>
      <img style={styles.googleIcon} src={zenithLogo} alt="logo" />
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const { profile } = useUserProfile();
  const identityApi = useApi(identityApiRef);
  const errorApi = useApi(errorApiRef);
  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
          {/* <SidebarItem icon={LibraryBooks} to="docs" text="Docs" /> */}
          <SidebarItem icon={Light} to="Lighthouse" text="Lighthouse" />
          <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
          <SidebarItem
            icon={CreateComponentIcon}
            to="create"
            text="Create..."
          />
          {/* End global nav */}
          {/* <SidebarScrollWrapper> */}
           
          {/* </SidebarScrollWrapper> */}
        </SidebarGroup>
        <SidebarSpace />
        <SidebarItem
          imageUrl={profile.picture}
          icon={HomeIcon}
          to="settings"
          text="Profile"
        />
        <div
          role="presentation"
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}
          onClick={() =>
            identityApi.signOut().catch(error => errorApi.post(error))
          }
        >
          <SidebarItem icon={Power} to="" text="Logout" />
        </div>
      </Sidebar>
      {children}
    </SidebarPage>
  );
};
