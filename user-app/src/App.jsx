import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Router, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login'
import LSCDashboard from './pages/LSCDashboard'
import CreateReservation from './pages/CreateReservation'
import DetailPage from './pages/DetailPage'
import ManagerDashboard from './pages/ManagerDashboard'
import SPVUpdatePage from './component/SPVUpdatePage'
import ListRoomPage from './pages/ListRoomPage'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route index element={<Login/>} />
        <Route path='home-lsc' element={<LSCDashboard />} />
        <Route path='create-reservation' element={<CreateReservation />} />
        <Route path='/list-room-available' element={<ListRoomPage />} />
        <Route path='/reservation/:reservationTransactionId' element={<DetailPage />} />
        <Route path='/manager-dashboard' element={<ManagerDashboard />}/>
        <Route path='/spv-update-page/:reservationTransactionId' element={<SPVUpdatePage />}/>
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
