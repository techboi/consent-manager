import React, { useState } from 'react'
import { ConsentManagerForm, useIntegration } from '@techboi/consent-manager'
import clsx from 'clsx'

import styles from './fallback-component.module.css'
import { EmbeddedConsentForm } from './embedded-consent-form'

export function CustomFallbackComponent({ integrationId }) {
  const integration = useIntegration(integrationId)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.wrapper, showForm && styles.flip)}>
        <div className={clsx('card', styles.side, styles.front)}>
          <div className={clsx('card__header', styles.header)}>
            <h3>{integration.title} is disabled to protect your privacy!</h3>
          </div>
          <div className={clsx('card__body', styles.description)}>
            <p>{integration.description}</p>
          </div>
          <div className={clsx('card__footer', styles.footer)}>
            <button
              className="button button--primary button--block"
              onClick={() => setShowForm(true)}
            >
              Enable {integration.title}
            </button>
          </div>
        </div>
        <div className={clsx('card', styles.side, styles.back)}>
          <ConsentManagerForm formComponent={EmbeddedConsentForm} />
        </div>
      </div>
    </div>
  )
}