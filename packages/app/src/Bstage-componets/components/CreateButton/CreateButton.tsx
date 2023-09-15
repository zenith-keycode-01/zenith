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

import { BackstageTheme, themes } from '@backstage/theme';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { Link as RouterLink, LinkProps, Link } from 'react-router-dom';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { Box, makeStyles } from '@material-ui/core';
import { colors } from '../../../themeUtils';

/**
 * Properties for {@link CreateButton}
 *
 * @public
 */
export type CreateButtonProps = {
  title: string;
} & Partial<Pick<LinkProps, 'to'>>;

const useStyles = makeStyles({
  main: {
    backgroundColor: colors.BACKGROUND_COLOR,
    // border: 'solid 1px #254E58',
    color: colors.PRIMARY_COLOR_2,
    fontWeight: 700,
    borderRadius: 25,
    padding: '15px 30px',
    border: '1px solid',
    borderColor: colors.PRIMARY_COLOR_2,
    // boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
  },
});

/**
 * Responsive Button giving consistent UX for creation of different things
 *
 * @public
 */
export function CreateButton(props: CreateButtonProps) {
  const classes = useStyles();
  const { title, to } = props;
  const isXSScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('xs'),
  );

  if (!to) {
    return null;
  }

  return isXSScreen ? (
    <IconButton
      component={RouterLink}
      color="primary"
      title={title}
      size="small"
      to={to}
    >
      <AddCircleOutline />
    </IconButton>
  ) : (
    // <Button component={RouterLink} variant="contained" color="primary" to={to}>
    //   {title}
    // </Button>
    <Box className={classes.main}>    
      <Link to={to}>
        {title}
      </Link>
    </Box>
  );
}

