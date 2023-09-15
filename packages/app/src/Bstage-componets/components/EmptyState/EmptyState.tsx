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

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { EmptyStateImage } from './EmptyStateImage';
import { colors } from '../../../themeUtils';
import { Box } from '@material-ui/core';

/** @public */
export type EmptyStateClassKey = 'root' | 'action' | 'imageContainer';

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2, 0, 0, 0),
    },
    action: {
      marginTop: theme.spacing(2),
    },
    imageContainer: {
      position: 'relative',
    },
  }),
  { name: 'BackstageEmptyState' },
);

type Props = {
  title: string;
  description?: string | JSX.Element;
  missing: 'field' | 'info' | 'content' | 'data' | { customImage: JSX.Element };
  action?: JSX.Element;
  style?: any;
  contentStyle?: any;
};

/**
 * Various placeholder views for empty state pages
 *
 * @public
 *
 */
export function EmptyState(props: Props) {
  const { title, description, missing, action, style, contentStyle } = props;
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-around"
      alignItems="flex-start"
      className={classes.root}
      spacing={2}
      style={{backgroundColor: colors.BACKGROUND_COLOR}}
    >
      <Grid lg={12} style={{boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)' ,color: colors.BACKGROUND_COLOR, backgroundColor: colors.PRIMARY_TEXT_COLOR, marginLeft: '10px', marginRight: '10px', borderRadius: '10px', padding: '10px', ...style}} item xs={12} md={6}>
        <Grid container direction="column">
          <Grid item xs>
            <Typography style={{padding:8}}variant="h5">{title}</Typography>
          </Grid>
          <Box style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '30px', ...contentStyle}}>
          <Grid item xs>
            <Typography variant="body1">{description}</Typography>
          </Grid>
          <Grid item xs className={classes.action}>
            {action}
          </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
