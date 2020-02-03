import React from 'react'
import PropTypes from 'prop-types'
import Pending from './PendingTrans'
import Login from '../core/src/components/Forms/Login'
import Title from '../core/src/components/Elements/Title'
import Copy from '../core/src/components/Elements/Copy'

const DistributorLoginForm = ({onLoginSubmit, loginPending, loginError}) => {

  let locked = false
  const handleSubmit = (event, form) => {
    if (!locked) {
      event.preventDefault()
      onLoginSubmit(
        form.email,
        form.password
      )
    }
    locked = true
  }
  
  return (
    <div id="LoginForm" className="w-full md:w-8/12 lg:w-8/12 flex">
      <div className="flex flex-col self-center text-black">
        <div className="py-2 mt-6">
          <Title fontWeight="bold" fontSize='lg' >Login to the TRACE DISTRIBUTOR PORTAL</Title>
          <Copy className="mt-3"><p>Login using your iOS credentials</p></Copy>
        </div>

        {loginPending ? <Pending /> : ( 
          <div className="">
            <Login handleSubmit={handleSubmit} loginResponse={loginError} submitBtnColor="green" displayForgotPassword={false}/>
          </div>
        )}

      </div>
    </div>
  )
}

DistributorLoginForm.propTypes = {
  onLoginSubmit: PropTypes.func.isRequired,
  loginError: PropTypes.string
}

export default DistributorLoginForm