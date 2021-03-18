import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form } from 'react-final-form'
import clsx from 'clsx'
import Anime from 'react-anime'
import { FiChevronUp } from 'react-icons/fi'

import {
  DecisionsFormProps,
  IntegrationConfigOptions,
  useConsentFormVisible,
} from '@consent-manager/core'

import { Switch as DefaultSwitch, SwitchProps } from './switch'
import defaultStyles from './index.module.css'
import { Introduction } from './introduction'
import { Integration } from './integration'
import {
  ToggleButton as DefaultToggleButton,
  ToggleButtonProps,
} from './toggle-button'

export interface Styles {
  [key: string]: string
}

export interface ToggleIconProps {
  [key: string]: string
}

export interface SubmitButtonProps {
  [key: string]: string
}

export interface UnobtrusiveConsentControlUIProps extends DecisionsFormProps {
  slideDuration: number
  styles: Styles
  ToggleButton?: React.ComponentType<ToggleButtonProps>
  ToggleIcon?: React.ComponentType<ToggleIconProps>
  Switch?: React.ComponentType<SwitchProps>
  SubmitButton?: React.ComponentType<SubmitButtonProps>
}

interface FormState {
  [key: string]: boolean
}

const DefaultSubmitButton: React.FC<SubmitButtonProps> = props => (
  <button {...props} />
)

export const UnobtrusiveConsentControlUI: React.FC<UnobtrusiveConsentControlUIProps> = ({
  integrations,
  initialValues,
  onSubmit,
  slideDuration = 1500,
  styles = defaultStyles,
  ToggleIcon = FiChevronUp,
  ToggleButton = DefaultToggleButton,
  Switch = DefaultSwitch,
  SubmitButton = DefaultSubmitButton,
}) => {
  const hasPendingDecisions = useConsentFormVisible()

  const [needsIntroduction, setNeedsIntroduction] = useState(
    hasPendingDecisions
  )

  const introductionFinished = useCallback(() => {
    setNeedsIntroduction(false)
  }, [setNeedsIntroduction])

  const [showForm, setShowForm] = useState(false)

  const toggleControlForm = useCallback(
    e => {
      e.preventDefault()
      setShowForm(v => !v)
    },
    [setShowForm]
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
      setShowForm(false)
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
    <div className={clsx(styles.wrapper)} id="consent-control-ui">
      {needsIntroduction && (
        <Introduction
          introductionFinished={introductionFinished}
          slideDuration={slideDuration}
        />
      )}
      <Form
        onSubmit={onSubmitCb}
        initialValues={initial}
        render={({ handleSubmit }) => (
          <>
            {showForm && (
              <Anime
                duration={slideDuration}
                translateY={['10%', '-100%']}
                easing="easeInOutQuad"
              >
                <form onSubmit={handleSubmit} className={clsx(styles.pane)}>
                  <div className={clsx(styles.content)}>
                    <h2>Website Settings</h2>
                    <p>
                      Some features are disabled by default to protect your
                      privacy:
                    </p>
                    {integrations.map(
                      (integration: IntegrationConfigOptions) => (
                        <Integration
                          key={integration.id}
                          Switch={Switch}
                          {...integration}
                        />
                      )
                    )}
                    <SubmitButton>Save</SubmitButton>
                  </div>
                </form>
              </Anime>
            )}
            <ToggleButton
              ToggleIcon={ToggleIcon}
              styles={styles}
              showForm={showForm}
              handleSubmit={handleSubmit}
              toggleControlForm={toggleControlForm}
            />
          </>
        )}
      />
    </div>
  )
}

export { FallbackComponent } from './fallback-component'