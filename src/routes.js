import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//PId and Spec Update
const PidUpdate = React.lazy(() => import('./views/pidUpdate/PidUpdate'))
const SpecUpdate = React.lazy(() => import('./views/specUpdate/SpecUpdate'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/pidupdate', name: 'PidUpdate', component: PidUpdate },
  { path: '/specupdate', name: 'SpecUpdate', component: SpecUpdate },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

export default routes
