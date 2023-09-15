import React from 'react';
import { Navigate, Route } from 'react-router-dom';

import { SearchPage } from '@backstage/plugin-search';

import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { googleAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage, OAuthRequestDialog, AlertDisplay } from './Bstage-componets';
import { CatalogEntityPage, CatalogIndexPage, catalogPlugin } from './Bstage-componets/plugins/catalog/src';
import { ScaffolderPage, scaffolderPlugin } from './Bstage-componets/plugins/scaffolder/src';
import { RequirePermission } from './Bstage-componets/plugins/permission-react/src';
import { CatalogImportPage, catalogImportPlugin } from './Bstage-componets/plugins/catalog-import/src';

import { LighthousePage } from './Bstage-componets/plugins/lighthouse/src';
import { CatalogGraphPage } from './Bstage-componets/plugins/catalog-graph/src';
import { apiDocsPlugin, ApiExplorerPage } from './Bstage-componets/plugins/api-docs/src';
import { TechDocsIndexPage, techdocsPlugin, TechDocsReaderPage } from './Bstage-componets/plugins/techdocs/src';
import { TechDocsAddons } from './Bstage-componets/plugins/techdocs-react/src';
import { TechRadarPage } from './Bstage-componets/plugins/tech-radar/src';
import { UserSettingsPage } from './Bstage-componets/plugins/user-settings/src';
import { orgPlugin } from './Bstage-componets/plugins/org/src';
import { colors } from './themeUtils';

const app = createApp({
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        auto
        providers={[
          {
            id: 'google',
            title: 'Google',
            message: 'Sign in using google',
            apiRef: googleAuthApiRef,
            // },
            // {
            //   id: 'github',
            //   title: 'Github',
            //   message: 'Sign in using github',
            //   apiRef: githubAuthApiRef,
          },
        ]}
      />
    ),
  },
  apis,
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
});


const routes = (
  
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/lighthouse" element={<LighthousePage />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1240} height={660} />}
    />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <div style={{backgroundColor: colors.BACKGROUND_COLOR, width: '100%', height:'100vh'}}>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </div>
);
