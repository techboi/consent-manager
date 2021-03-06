import * as React from 'react'

import { IntegrationConfig } from '@consent-manager/core'

const Icon: React.FC = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
    />
  </svg>
)

export function videoIncIntegration(): IntegrationConfig {
  return {
    id: 'video-platform',
    title: 'Video Inc.',
    category: 'social',
    description: 'Video Inc. is a popular service to share clips of cats.',
    color: '#208075',
    contrastColor: '#fff',
    Icon,
  }
}
