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

import React, { ReactNode } from 'react';
import { CatalogTable, CatalogTableRow } from '../CatalogTable';
import { Content, Page } from '../../../../../layout';
// import {

// } from '@backstage/plugin-catalog-react';
import { CatalogFilterLayout, EntityKindPicker, EntityListProvider,  EntityTypePicker,
  UserListFilterKind,
  EntityOwnerPickerProps, } from '../../../../catalog-react/src';
import { useUserProfile } from '../../../../../../apiUtils/useUserProfileInfo';
import { colors } from '../../../../../../themeUtils';
import { Box, Typography } from '@material-ui/core';

/**
 * Props for root catalog pages.
 *
 * @public
 */
export interface DefaultCatalogPageProps {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
  actions?: TableProps<CatalogTableRow>['actions'];
  initialKind?: string;
  tableOptions?: TableProps<CatalogTableRow>['options'];
  emptyContent?: ReactNode;
  ownerPickerMode?: EntityOwnerPickerProps['mode'];
}

export function DefaultCatalogPage(props: DefaultCatalogPageProps) {
  const {
    columns,
    actions,
    initialKind = 'component',
    tableOptions = {},
    emptyContent,
  } = props;
  const { displayName } = useUserProfile();
  const renderWelcome = () => {
    return (
      <div
        style={{
          color: colors.PRIMARY_TEXT_COLOR,
          height: '78px',
          // backgroundColor: 'white',
          padding: '20px',
          marginBottom: 20,
          // boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
        style={{fontFamily: 'Inter',           fontSize: '32px',
        fontWeight: 600}}
          data-testid="header-title"
        >{`Welcome ${displayName}`}</Typography>
      </div>
    );
  };

  return (
    <Page themeId="home">
      <Content style={{padding: 0}}>
        {renderWelcome()}
        <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <div style={{display: 'flex', width: '150px', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px'}}>
                <EntityKindPicker initialFilter={initialKind} />
              </div>
              <EntityTypePicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <Box style={{margin: '20px 40px'}}>
              <CatalogTable
                columns={columns}
                actions={actions}
                tableOptions={tableOptions}
                emptyContent={emptyContent}
              />
              </Box>
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </Page>
  );
}
