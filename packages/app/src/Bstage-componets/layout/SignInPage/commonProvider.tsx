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

import React from 'react';
import {
  ProviderComponent,
  ProviderLoader,
  SignInProvider,
  SignInProviderConfig,
} from './types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { ForwardedError } from '@backstage/errors';
import { UserIdentity } from './UserIdentity';
import googleIcon from '../../icons/google_icon.png';
import { colors } from '../../../themeUtils';

const styles = {
  authBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',

  },
  buttonStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 15px',
    borderRadius: '30px',
    cursor: 'pointer',
    borderColor: 'rgba(0,0,0,0.6)',
    borderWidth: '1px',
    borderStyle: 'solid',
    transition: 'background-color 0.3s ease',
  },
  iconStyle: {
    marginRight: '8px',
    width: '20px',
    height: '20px',
  },
  textStyles: {
    fontWeight: 400,
    fontSize: '20px',
    color:colors.PRIMARY_TEXT_COLOR
  },
  googleIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    marginRight: '10px'
  },
  subTitle: {
    fontWeight: 400,
    fontSize: '70px',
    paddingBottom: '50px',
    fontFamily: 'Gugi',
    width: 'max-Content',
    color:colors.PRIMARY_TEXT_COLOR
  },
  title: {
    fontWeight: 600,
    fontSize: '24px',
    paddingTop: '10px',
    paddingBottom: '20px'
  }
};

const Component: ProviderComponent = ({
  config,
  onSignInStarted,
  onSignInSuccess,
  onSignInFailure,
}) => {
  const { apiRef, title, message } = config as SignInProviderConfig;
  const authApi = useApi(apiRef);
  const errorApi = useApi(errorApiRef);

  const handleLogin = async () => {
    try {
      onSignInStarted();
      const identityResponse = await authApi.getBackstageIdentity({
        instantPopup: true,
      });
      if (!identityResponse) {
        onSignInFailure();
        throw new Error(
          `The ${title} provider is not configured to support sign-in`,
        );
      }

      const profile = await authApi.getProfile();

      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          profile,
          authApi,
        }),
      );
    } catch (error) {
      onSignInFailure();
      errorApi.post(new ForwardedError('Login failed', error));
    }
  };

  return (
    <div style={styles.authBox} >
      <div style={styles.subTitle}>Welcome to Zenith</div>
      {/* <div style={styles.title}>Devs Do It</div> */}
      <div role='presentation' style={styles.buttonStyle} onClick={handleLogin}>
         <img style={styles.googleIcon} src={googleIcon} alt="Google logo" />
        <span style={styles.textStyles}>Continue with Google</span>
      </div>
    </div>
  );
};

const loader: ProviderLoader = async (apis, apiRef) => {
  const authApi = apis.get(apiRef)!;

  const identityResponse = await authApi.getBackstageIdentity({
    optional: true,
  });

  if (!identityResponse) {
    return undefined;
  }

  const profile = await authApi.getProfile();

  return UserIdentity.create({
    identity: identityResponse.identity,
    profile,
    authApi,
  });
};

export const commonProvider: SignInProvider = { Component, loader };
