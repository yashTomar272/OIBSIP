import React, { useState } from 'react'
import Layout from './Layout'
import Header from '../components/Header'
import PizzaShow from './PizzaShow'
import PizzaCard from '../components/PizzaCard'
import PizzaBuilder from '../components/PizzaBuilder'
import About from './About'
import Chefs from './Chefs'
import Footer from '../components/Footer'

const Home = () => {

  return (
    <>
      <Layout>
        <Header />
        <PizzaShow />
       <About/>
       <Chefs/>

      </Layout>
    </>
  )
}

export default Home

