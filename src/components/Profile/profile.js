import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header/header'
import Sidebar from '../Sidebar/sidebar'
import '../App.css'
import './profile.css'
import EditProfile from './edit_profile'
import ViewProfile from './view_profile'

const Profile = () => (
  <div>
    <Header />
      <div><ViewProfile /></div>
  </div>
)

export default Profile