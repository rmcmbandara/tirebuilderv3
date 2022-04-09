import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
//Redux action import -----------------
//--Actions
import { toggleSideBarShow } from '../redux/sideBarShow/sideBarShowActions'

//Compoenents import---------------
import TireDetailDesplayComp from './TireDetailDesplayComp'
import WgtDisplay from './ScaleWgtDisplay'

//Functions----------------------------

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const dataAvl = useSelector((state) => state.dataAvlReducer)
  return (
    <CHeader position="sticky" className="mb-1 d-flex justify-content-center">
      <CContainer>
        <CHeaderToggler
          className="ps-1 d-inline"
          onClick={() => dispatch(toggleSideBarShow(!sidebarShow))}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {dataAvl.tcAvl ? <TireDetailDesplayComp /> : <></>}
        <h1></h1>
      </CContainer>
      <CHeaderDivider />
    </CHeader>
  )
}
export default AppHeader
