import React from 'react'
import BandSticerPrintView from './views/bandSticker/BandSticerPrintView'
import PressStickerPrintView from './views/pressStikerPrint/PressStickerPrintView'
import CompoundWeighingView from './views/compoundWeingView/TireBuilderView'
import OrderUpdateView from './views/orderUpdate/OrderUpdateView'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//TireBuilder
const TireBuilderView = React.lazy(() => import('./views/tireBuilder/TireBuilderView'))

const PidUpdate = React.lazy(() => import('./views/pidUpdate/PidUpdate'))
const SpecUpdate = React.lazy(() => import('./views/specUpdate/SpecUpdate'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/pidupdate', name: 'PidUpdate', component: PidUpdate },
  { path: '/specupdate', name: 'SpecUpdate', component: SpecUpdate },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/tirebuilder', name: 'SpecUpdate', component: TireBuilderView },
  { path: '/bandprint', name: 'BandPrint', component: BandSticerPrintView },
  { path: '/pressstickerprint', name: 'PressStickerPrint', component: PressStickerPrintView },
  { path: '/crackerMill', name: 'crackerMill', component: CompoundWeighingView },
  { path: '/orderupdate', name: 'crackerMill', component: OrderUpdateView },
]

export default routes
