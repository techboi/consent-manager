import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form } from 'react-final-form'
import clsx from 'clsx'
import {
  DecisionsFormProps,
  IntegrationConfigOptions,
  useConsentFormVisible,
} from '@techboi/consent-manager'
import { FiChevronUp } from 'react-icons/fi'

import { Switch as DefaultSwitch, SwitchProps } from './switch'
import defaultStyles from './index.module.css'
import { Introduction } from './introduction'
import { Integration } from './integration'

export interface UnobtrusiveConsentControlUIProps extends DecisionsFormProps {
  slideDuration: number
  styles: { [key: string]: string }
  ToggleIcon: React.ComponentType
  Switch: React.ComponentType<SwitchProps>
  Button: React.ComponentType
  //@todo make sure we can pass all relevant components + add typings for props
}

interface FormState {
  [key: string]: boolean
}

export const UnobtrusiveConsentControlUI: React.FC<UnobtrusiveConsentControlUIProps> = ({
  integrations,
  initialValues,
  onSubmit,
  slideDuration = 1000,
  styles = defaultStyles,
  ToggleIcon = FiChevronUp,
  Switch = DefaultSwitch,
  Button = props => <button {...props} />,
}) => {
  const hasPendingDecisions = useConsentFormVisible()

  const [needsIntroduction, setNeedsIntroduction] = useState(
    hasPendingDecisions
  )

  const [slideUp, setSlideUp] = useState(false)

  const toggleControlForm = useCallback(
    e => {
      e.preventDefault()
      setSlideUp(v => !v)
    },
    [setSlideUp]
  )

  // @todo calling onSubmit causes rerender
  const onSubmitCb = useCallback(
    values => {
      const enabled = []
      for (const [key, value] of Object.entries(values)) {
        if (value) {
          enabled.push(key)
        }
      }
      setSlideUp(false)
      onSubmit({ enabled })
    },
    [onSubmit]
  )

  const initial = useMemo(() => {
    const initialState: FormState = {}
    for (const integration of integrations) {
      initialState[integration.id] = initialValues.enabled.includes(
        integration.id
      )
    }

    return initialState
  }, [integrations, initialValues])

  // Check if component was mounted for SSR
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [setIsMounted])

  // Do not render the interface on SSR.
  if (!isMounted) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.wrapper,
        styles.pane,
        styles.slide,
        slideUp && styles.slideUp
      )}
      style={{
        transitionDuration: `${slideDuration}ms`,
      }}
      id="consent-control-ui"
    >
      <button
        className={clsx(styles.toggleButton)}
        title={`Toggle website settings visibility`}
        onClick={toggleControlForm}
      >
        <div className={clsx(styles.pane, styles.toggleButtonContent)}>
          <ToggleIcon className={clsx(slideUp && styles.inverted)} />
        </div>
      </button>
      <Introduction
        setSlideUp={setSlideUp}
        needsIntroduction={needsIntroduction}
        setNeedsIntroduction={setNeedsIntroduction}
        slideDuration={slideDuration}
      />
      {!needsIntroduction && (
        <Form
          onSubmit={onSubmitCb}
          initialValues={initial}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className={clsx(styles.content)}>
                <h2>Website Settings</h2>
                <p>
                  Some features are disabled by default to protect your privacy:
                </p>
                {integrations.map((integration: IntegrationConfigOptions) => (
                  <Integration
                    key={integration.id}
                    Switch={Switch}
                    {...integration}
                  />
                ))}
                <Button>Save</Button>
              </div>
            </form>
          )}
        />
      )}
    </div>
  )
}