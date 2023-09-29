import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Router, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login'
import LSCDashboard from './pages/LSCDashboard'
import CreateReservation from './pages/CreateReservation'
import DetailPage from './pages/DetailPage'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route index element={<Login/>} />
        <Route path='home-lsc' element={<LSCDashboard />} />
        <Route path='create-reservation' element={<CreateReservation />} />
        <Route path='/reservation/:reservationTransactionId' element={<DetailPage />} />
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
