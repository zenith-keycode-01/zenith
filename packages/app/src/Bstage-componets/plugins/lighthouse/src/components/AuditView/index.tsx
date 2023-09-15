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

import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  generatePath,
  Link,
  resolvePath,
  useNavigate,
  useParams,
} from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { Audit, Website } from '@backstage/plugin-lighthouse-common';
import { lighthouseApiRef } from '../../api';
import { formatTime } from '../../utils';
import AuditStatusIcon from '../AuditStatusIcon';

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../plugin';
import { Content, ContentHeader, Header, HeaderLabel, InfoCard, Page } from '../../../../../layout';
import { Progress } from '../../../../../components';
import { colors } from '../../../../../../themeUtils';

// TODO(freben): move all of this out of index

const useStyles = makeStyles({
  contentGrid: {
    height: '100%',
  },
  iframe: {
    border: '0',
    width: '100%',
    height: '100%',
  },
  errorOutput: { whiteSpace: 'pre' },
});

interface AuditLinkListProps {
  audits?: Audit[];
  selectedId: string;
}
const AuditLinkList = ({ audits = [], selectedId }: AuditLinkListProps) => {
  const fromPath = useRouteRef(rootRouteRef)?.() ?? '../';
  return (
    <List
      data-testid="audit-sidebar"
      component="nav"
      aria-label="lighthouse audit history"
    >
      {audits.map(audit => (
        <ListItem
        style={{color:colors.PRIMARY_COLOR_2, backgroundColor: colors.WHITE}}
          key={audit.id}
          selected={audit.id === selectedId}
          button
          component={Link}
          replace
          to={resolvePath(
            generatePath('audit/:id', { id: audit.id }),
            fromPath,
          )}
        >
          <ListItemIcon>
            <AuditStatusIcon audit={audit} />
          </ListItemIcon>
          <ListItemText primary={formatTime(audit.timeCreated)} />
        </ListItem>
      ))}
    </List>
  );
};

const AuditView = ({ audit }: { audit?: Audit }) => {
  const classes = useStyles();
  const params = useParams() as { id: string };
  const { url: lighthouseUrl } = useApi(lighthouseApiRef);

  if (audit?.status === 'RUNNING') return <Progress />;
  if (audit?.status === 'FAILED')
    return (
      <Alert severity="error">
        This audit failed when attempting to run after several retries. Check
        that your instance of lighthouse-audit-service can successfully connect
        to your website and try again.
      </Alert>
    );

  return (
    <InfoCard cardStyle={{backgroundColor: colors.WHITE}} customStyle={{boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.1)', height: '100%'}}>
      <iframe
        className={classes.iframe}
        title={`Lighthouse audit${audit?.url ? ` for ${audit.url}` : ''}`}
        src={`${lighthouseUrl}/v1/audits/${encodeURIComponent(params.id)}`}
      />
    </InfoCard>
  );
};

export const AuditViewContent = () => {
  const lighthouseApi = useApi(lighthouseApiRef);
  const fromPath = useRouteRef(rootRouteRef)?.() ?? '../';
  const params = useParams() as { id: string };
  const classes = useStyles();
  const navigate = useNavigate();

  const {
    loading,
    error,
    value: nextValue,
  } = useAsync(
    async () => await lighthouseApi.getWebsiteForAuditId(params.id),
    [params.id],
  );
  const [value, setValue] = useState<Website>();
  useEffect(() => {
    if (!!nextValue && nextValue.url !== value?.url) {
      setValue(nextValue);
    }
  }, [value, nextValue, setValue]);

  let content: ReactNode = null;
  if (value) {
    content = (
      <Grid style={{boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', backgroundColor: colors.WHITE, width: '100%', borderRadius: '10px', marginRight: '2px', marginLeft: '2px'}} container alignItems="stretch" className={classes.contentGrid}>
        <Grid item xs={3}>
          <AuditLinkList audits={value?.audits} selectedId={params.id} />
        </Grid>
        <Grid item xs={9} >
          <AuditView audit={value?.audits.find(a => a.id === params.id)} />
        </Grid>
      </Grid>
    );
  } else if (loading) {
    content = <Progress />;
  } else if (error) {
    content = (
      <Alert
        data-testid="error-message"
        severity="error"
        className={classes.errorOutput}
      >
        {error.message}
      </Alert>
    );
  }

  let createAuditButtonUrl = 'create-audit';
  if (value?.url) {
    createAuditButtonUrl += `?url=${encodeURIComponent(value.url)}`;
  }

  return (
    <Grid container style={{height: '85%'}} >
      <ContentHeader
        title={value?.url || 'Audit'}
        boxStyle = {{backgroundColor: colors.BACKGROUND_COLOR, color: '#4f4a41', padding: '20px', borderRadius: '10px'}}
        description="See a history of all Lighthouse audits for your website run through Backstage."
      >
        <Button
          style={{color: colors.PRIMARY_COLOR_2,border: 'solid 1px #85aab1', borderRadius: 40}} 
          onClick={() => navigate(resolvePath(createAuditButtonUrl, fromPath))}
        >
          Create New Audit
        </Button>
      </ContentHeader>
      {content}
      </Grid> 
  );
};

const ConnectedAuditView = () => (
  <Page themeId="tool">
    <Header title="Lighthouse" subtitle="Website audits powered by Lighthouse">
      <HeaderLabel label="Owner" value="Spotify" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content style={{padding: '20px 50px'}}>
      <AuditViewContent />
    </Content>
  </Page>
);

export default ConnectedAuditView;
