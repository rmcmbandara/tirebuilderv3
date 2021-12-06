import React from 'react'

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
]

export default routes
