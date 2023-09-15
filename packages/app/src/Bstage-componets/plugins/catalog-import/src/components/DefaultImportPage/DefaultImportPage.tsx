/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Grid, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import { ImportInfoCard } from '../ImportInfoCard';
import { ImportStepper } from '../ImportStepper';
import { Content, ContentHeader, Header, Page } from '../../../../../layout';

/**
 * The default catalog import page.
 *
 * @public
 */
export const DefaultImportPage = () => {

  const contentItems = [
    <Grid item xs={12} md={4} lg={6} xl={8}>
      <ImportInfoCard />
    </Grid>,

    <Grid item xs={12} md={8} lg={6} xl={4}>
      <ImportStepper />
    </Grid>,
  ];

  return (
    <Page themeId="home">
      <Header title="Register an existing component" />
      <Content>
        <Grid container spacing={2}>
          {contentItems}
        </Grid>
      </Content>
    </Page>
  );
};
