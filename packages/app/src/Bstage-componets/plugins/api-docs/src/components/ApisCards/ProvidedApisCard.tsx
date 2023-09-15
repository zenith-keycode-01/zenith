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

import { ApiEntity, RELATION_PROVIDES_API } from '@backstage/catalog-model';
import { Typography } from '@material-ui/core';
import React from 'react';
import { apiEntityColumns } from './presets';
import { InfoCard, InfoCardVariants } from '../../../../../layout';
import { CodeSnippet, Link, Progress, TableColumn, WarningPanel } from '../../../../../components';
import { EntityTable, useEntity, useRelatedEntities } from '../../../../catalog-react/src';

/**
 * @public
 */
export const ProvidedApisCard = (props: {
  variant?: InfoCardVariants;
  columns?: TableColumn<ApiEntity>[];
}) => {
  const { variant = 'gridItem', columns = apiEntityColumns } = props;
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_PROVIDES_API,
  });

  if (loading) {
    return (
      <InfoCard variant={variant} title="Provided APIs">
        <Progress />
      </InfoCard>
    );
  }

  if (error || !entities) {
    return (
      <InfoCard variant={variant} title="Provided APIs">
        <WarningPanel
          severity="error"
          title="Could not load APIs"
          message={<CodeSnippet text={`${error}`} language="text" />}
        />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title="Provided APIs"
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">
            This {entity.kind.toLocaleLowerCase('en-US')} does not provide any
            APIs.
          </Typography>
          <Typography variant="body2">
            <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional">
              Learn how to change this.
            </Link>
          </Typography>
        </div>
      }
      columns={columns}
      entities={entities as ApiEntity[]}
    />
  );
};