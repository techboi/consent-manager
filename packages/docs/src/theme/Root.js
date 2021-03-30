import React from 'react'
import clsx from 'clsx'

import { ConsentManager, ConsentManagerForm } from '@consent-manager/core'
import createPersistedState from 'use-persisted-state'

import { mapboxIntegration } from '@consent-manager/integration-mapbox'
import { matomoPrivacyAwareIntegration } from '@consent-manager/integration-matomo'
import { vimeoIntegration } from '@consent-manager/integration-vimeo'
import { youtubeIntegration } from '@consent-manager/integration-youtube'
import { algoliaIntegration } from '@consent-manager/integration-algolia'

import {
  InterfaceDefault,
  FallbackComponent,
} from '@consent-manager/interface-default'
import '@consent-manager/interface-default/dist/default.min.css'

const Button = props => (
  <button
    type="submit"
    {...props}
    className={clsx(
      props.className,
      'button',
      'button--primary',
      'button--block'
    )}
  />
)

const useConsentStateStore = createPersistedState('consent-manager-docs')

// Default implementation, that you can customize
function Root({ children }) {
  const storage = useConsentStateStore()
  const config = {
    integrations: [
      matomoPrivacyAwareIntegration({
        matomoURL: 'https://trackboi.techboi.io/',
        siteID: 11,
      }),
      youtubeIntegration(),
      vimeoIntegration(),
      mapboxIntegration(),
      algoliaIntegration(),
    ],
  }

  return (
    <ConsentManager
      config={config}
      store={storage}
      fallbackComponent={props => (
        <FallbackComponent {...props} Button={Button} />
      )}
    >
      {children}
      <ConsentManagerForm
        formComponent={InterfaceDefault}
        SubmitButton={Button}
      />
    </ConsentManager>
  )
}

export default Root
