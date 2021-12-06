import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//TireBuilder
const TireBuilderView = React.lazy(() => import('./views/tireBuilder/TireBuilderView'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/tirebuilder', name: 'SpecUpdate', component: TireBuilderView },
]

export default routes
