import React from 'react'
import { Route, Routes } from 'react-router'
import Layout from './app/Layout/layout'
import Home from './app/Home/ui'
import Blogs from './app/Blogs/ui'
import PlantCare from './app/Plant Care/ui'
import Shop from './app/Shop/ui'
import Heart from './app/Heart/heart'
import ToCard from './app/To Card/toCard'
import Checkout from './app/Checkout/checkout'
import Info from './app/Info/info'
import Profile from './app/Profile/profile'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path='Blogs' element={<Blogs/>} />
        <Route path='Plant Care' element={<PlantCare/>} />
        <Route path='Shop' element={<Shop/>}/>
        <Route path='Heart' element={<Heart/>}/>
        <Route path='ToCard' element={<ToCard/>}/>
        <Route path='Checkout' element={<Checkout/>}/>
        <Route path='/info/:id' element={<Info/>}/>
        <Route path='Profile' element={<Profile/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App