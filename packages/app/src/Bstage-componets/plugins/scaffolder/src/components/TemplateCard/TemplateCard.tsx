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
  DEFAULT_NAMESPACE,
  Entity,
  EntityLink,
  parseEntityRef,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  Link,
  LinkButton,
} from '@backstage/core-components';
import {
  IconComponent,
  useApi,
  useApp,
  useRouteRef,
} from '@backstage/core-plugin-api';
import {
  ScmIntegrationIcon,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  EntityRefLinks,
  FavoriteEntity,
  getEntityRelations,
  getEntitySourceLocation,
} from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import { selectedTemplateRouteRef, viewTechDocRouteRef } from '../../routes';
import { ItemCardHeader } from '../../../../../layout';
import { colors } from '../../../../../../themeUtils';
import { MarkdownContent } from '../../../../../components';

const useStyles = makeStyles<
  BackstageTheme,
  { fontColor: string; backgroundImage: string }
>(theme => ({
  cardHeader: {
    position: 'relative',
  },
  title: {
    backgroundImage: ({ backgroundImage }) => backgroundImage,
    color: ({ fontColor }) => fontColor,
  },
  box: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 1,
    paddingBottom: '0.2rem',
  },
  linksLabel: {
    padding: '0 16px',
  },
  description: {
    '& p': {
      margin: '0px',
      fontSize: 14,
      fontFamily: 'Arial, Helvetica, sans-serif',
      color: '#282829',
    },
  },
  leftButton: {
    marginRight: 'auto',
  },
  starButton: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    padding: '0.25rem',
    color: 'white',
  },
}));

const MuiIcon = ({ icon: Icon }: { icon: IconComponent }) => <Icon />;

const useDeprecationStyles = makeStyles(theme => ({
  deprecationIcon: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(3.5),
    padding: '0.25rem',
  },
  link: {
    color: theme.palette.warning.light,
  },
}));

export type TemplateCardProps = {
  template: TemplateEntityV1beta3;
  deprecated?: boolean;
};

type TemplateProps = {
  description: string;
  tags: string[];
  title: string;
  type: string;
  name: string;
  links: EntityLink[];
};

const getTemplateCardProps = (
  template: TemplateEntityV1beta3,
): TemplateProps & { key: string } => {
  return {
    key: template.metadata.uid!,
    name: template.metadata.name,
    title: `${(template.metadata.title || template.metadata.name) ?? ''}`,
    type: template.spec.type ?? '',
    description: template.metadata.description ?? '-',
    tags: (template.metadata?.tags as string[]) ?? [],
    links: template.metadata.links ?? [],
  };
};

const DeprecationWarning = () => {
  const styles = useDeprecationStyles();

  const Title = (
    <Typography style={{ padding: 10, maxWidth: 300 }}>
      This template uses a syntax that has been deprecated, and should be
      migrated to a newer syntax. Click for more info.
    </Typography>
  );

  return (
    <div className={styles.deprecationIcon}>
      <Tooltip title={Title}>
        <Link
          to="https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3"
          className={styles.link}
        >
          <WarningIcon />
        </Link>
      </Tooltip>
    </div>
  );
};

export const TemplateCard = ({ template, deprecated }: TemplateCardProps) => {
  const app = useApp();
  const backstageTheme = useTheme<BackstageTheme>();
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const templateProps = getTemplateCardProps(template);
  const ownedByRelations = getEntityRelations(
    template as Entity,
    RELATION_OWNED_BY,
  );
  const themeId = backstageTheme.getPageTheme({ themeId: templateProps.type })
    ? templateProps.type
    : 'other';
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles({
    fontColor: theme.fontColor,
    backgroundImage: theme.backgroundImage,
  });
  const { name, namespace } = parseEntityRef(stringifyEntityRef(template));
  const href = templateRoute({ templateName: name, namespace });

  // TechDocs Link
  const viewTechDoc = useRouteRef(viewTechDocRouteRef);
  const viewTechDocsAnnotation =
    template.metadata.annotations?.['backstage.io/techdocs-ref'];
  const viewTechDocsLink =
    !!viewTechDocsAnnotation &&
    !!viewTechDoc &&
    viewTechDoc({
      namespace: template.metadata.namespace || DEFAULT_NAMESPACE,
      kind: template.kind,
      name: template.metadata.name,
    });

  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;

  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const sourceLocation = getEntitySourceLocation(template, scmIntegrationsApi);

  return (
    <Card style={{boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', minWidth: '450px', backgroundColor: colors.WHITE}}>
      <CardMedia className={classes.cardHeader}>
        <FavoriteEntity className={classes.starButton} entity={template} />
        {deprecated && <DeprecationWarning />}
        <ItemCardHeader
          title={templateProps.title}
          subtitle={templateProps.type}
          classes={{ root: classes.title }}
        />
      </CardMedia>
      <CardContent
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <Box className={classes.box}>
          <Typography variant="body2" className={classes.label}>
            Description
          </Typography>
          <MarkdownContent
            className={classes.description}
            content={templateProps.description}
          />
        </Box>
        <Box className={classes.box}>
          <Typography variant="body2" className={classes.label}>
            Owner
          </Typography>
          <EntityRefLinks entityRefs={ownedByRelations} defaultKind="Group" style={{ color:'#281e5d'}} />
        </Box>
      </CardContent>
      <CardActions>
        <div className={classes.leftButton}>
          {sourceLocation && (
            <Tooltip
              title={
                sourceLocation.integrationType ||
                sourceLocation.locationTargetUrl
              }
            >
              <IconButton
                className={classes.leftButton}
                href={sourceLocation.locationTargetUrl}
              >
                <ScmIntegrationIcon type={sourceLocation.integrationType} />
              </IconButton>
            </Tooltip>
          )}
          {viewTechDocsLink && (
            <Tooltip title="View TechDocs">
              <IconButton
                className={classes.leftButton}
                href={viewTechDocsLink}
              >
                <MuiIcon icon={iconResolver('docs')} />
              </IconButton>
            </Tooltip>
          )}
          {templateProps.links?.map((link, i) => (
            <Tooltip key={`${link.url}_${i}`} title={link.title || link.url}>
              <IconButton size="medium" href={link.url}>
                <MuiIcon icon={iconResolver(link.icon)} />
              </IconButton>
            </Tooltip>
          ))}
        </div>
        <Box style={{padding: 20}}>
          <Link
          to={href}
          style={{color: '#4a275d', fontWeight: 'bold'}}
          >
            CHOOSE
          </Link>
        </Box>
      </CardActions>
    </Card>
  );
};
