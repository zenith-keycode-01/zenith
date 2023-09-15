/*
 * Copyright 2020 The Backstage Authors
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

import { Grid, Input, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { RadarComponent, type TechRadarComponentProps } from './RadarComponent';
import { Content, ContentHeader, Header, Page } from '../../../../layout';
import { Link } from '../../../../components';
import { SupportButton } from '@backstage/core-components';
import { colors } from '../../../../../themeUtils';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

/**
 * Properties for {@link TechRadarPage}
 *
 * @public
 */
export interface TechRadarPageProps extends TechRadarComponentProps {
  /**
   * Title
   */
  title?: string;
  /**
   * Subtitle
   */
  subtitle?: string;
  /**
   * Page Title
   */
  pageTitle?: string;
}

/**
 * Main Page of Tech Radar
 *
 * @public
 */
export function RadarPage(props: TechRadarPageProps) {
  const {
    title = 'Tech Radar',
    subtitle = 'Pick the recommended technologies for your projects',
    pageTitle = 'Company Radar',
    ...componentProps
  } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = React.useState('');

  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle} />
      <Content className={classes.overflowXScroll}>
        <ContentHeader title={pageTitle}>
          <Input
            id="tech-radar-filter"
            type="search"
            placeholder="Filter"
            style={{color: colors.PRIMARY_TEXT_COLOR}}
            onChange={e => setSearchText(e.target.value)}
          />
        </ContentHeader>
        <Grid container spacing={3} direction="row">
          <Grid item xs={12} sm={6} md={4}>
            <RadarComponent searchText={searchText} {...componentProps} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
}