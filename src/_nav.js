import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilLibraryAdd,
  cilBarcode,
  cibProductHunt,
  cilLifeRing,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _navx = [
  {
    component: CNavItem,
    name: 'Tire Builder',
    to: '/tirebuilder',
    icon: <CIcon icon={cilLifeRing} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Band Stiker',
    to: '/bandprint',
    icon: <CIcon icon={cilBarcode} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Press Sticker',
    to: '/pressstickerprint',
    icon: <CIcon icon={cibProductHunt} customClassName="nav-icon" />,
  },
]

export default _navx
