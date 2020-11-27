import React, { useMemo } from 'react'

import {
  IntegrationConfig,
  PrivacyManagerConfig,
  PrivacyManagerDecisions
} from '../config'
import { useDecisions } from '../decisions'

type IntegrationWithWrapperComponent = IntegrationConfig &
  Required<Pick<IntegrationConfig, 'wrapperComponent'>>

function useWrapperComponents(
  config: PrivacyManagerConfig,
  decisions: PrivacyManagerDecisions
): React.ComponentType {
  const Wrapper: React.ComponentType = useMemo(() => {
    return (({ children }) => {
      return config.integrations
        .filter((i) => decisions[i.id] === true)
        .filter((i): i is IntegrationWithWrapperComponent =>
          Boolean(i.wrapperComponent)
        )
        .reverse()
        .reduce((children, { wrapperComponent: WrapperComponent }) => {
          return <WrapperComponent>{children}</WrapperComponent>
        }, children)
    }) as React.FC
  }, [config.integrations, decisions])
  return Wrapper
}

export const IntegrationWrapperComponents: React.FC<{
  config: PrivacyManagerConfig
}> = ({ config, children }) => {
  const [decisions] = useDecisions()

  const Wrapper = useWrapperComponents(config, decisions)
  return <Wrapper>{children}</Wrapper>
}
