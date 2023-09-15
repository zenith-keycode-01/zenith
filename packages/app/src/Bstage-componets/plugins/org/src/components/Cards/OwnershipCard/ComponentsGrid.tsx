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

import { Entity } from '@backstage/catalog-model';
import {
  Link,
  OverflowTooltip,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import pluralize from 'pluralize';
import { catalogIndexRouteRef } from '../../../routes';
import { useGetEntities } from './useGetEntities';
import { EntityRelationAggregation } from './types';
import { colors } from '../../../../../../../themeUtils';

const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    card: {
      // border: `1px solid #112d32`,
      // boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
      padding: theme.spacing(2),
      transition: `${theme.transitions.duration.standard}ms`,
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
      height: '100%',
      backgroundColor: '#d7d7d2',
    },
    bold: {
      fontWeight: theme.typography.fontWeightBold,
    },
    smallFont: {
      fontSize: theme.typography.body2.fontSize,
    },
    entityTypeBox: {
      background: (props: { type: string }) =>
        theme.getPageTheme({ themeId: props.type }).backgroundImage,
      color: (props: { type: string }) =>
        theme.getPageTheme({ themeId: props.type }).fontColor,
    },
  }),
);

const EntityCountTile = ({
  counter,
  type,
  kind,
  url,
}: {
  counter: number;
  type?: string;
  kind: string;
  url: string;
}) => {
  const classes = useStyles({ type: type ?? kind });

  const rawTitle = type ?? kind;
  const isLongText = rawTitle.length > 10;

  return (
    <Link to={url} variant="body2">
      <Box
        className={`${classes.card}`}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography style={{color: colors.PRIMARY_COLOR_2}} className={classes.bold} variant="h6">
          {counter}
        </Typography>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography
          style={{color: colors.PRIMARY_COLOR_2, fontSize: 18}}
            // className={`${classes.bold} ${isLongText && classes.smallFont}`}
          >
            <OverflowTooltip
              text={pluralize(rawTitle.toLocaleUpperCase('en-US'), counter)}
            />
          </Typography>
        </Box>
        {type && <Typography style={{color: colors.PRIMARY_COLOR_2, fontSize: 14}} variant="subtitle1">{kind}</Typography>}
      </Box>
    </Link>
  );
};

export const ComponentsGrid = ({
  entity,
  relationsType,
  entityFilterKind,
  entityLimit = 6,
}: {
  entity: Entity;
  relationsType: EntityRelationAggregation;
  entityFilterKind?: string[];
  entityLimit?: number;
}) => {
  const catalogLink = useRouteRef(catalogIndexRouteRef);
  const { componentsWithCounters, loading, error } = useGetEntities(
    entity,
    relationsType,
    entityFilterKind,
    entityLimit,
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid style={{marginTop: 40, gap: 25, justifyContent: 'center'}} container>
      {componentsWithCounters?.map(c => (
        <Grid item xs={4} md={4} lg={2} key={c.type ?? c.kind}>
          <EntityCountTile
            counter={c.counter}
            kind={c.kind}
            type={c.type}
            url={`${catalogLink()}/?${c.queryParams}`}
          />
        </Grid>
      ))}
    </Grid>
  );
};
