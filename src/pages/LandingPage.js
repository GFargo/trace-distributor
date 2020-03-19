import React from 'react'
import Button from '../core/src/components/Elements/Button'
import Title from '../core/src/components/Elements/Title'
import Copy from '../core/src/components/Elements/Copy'

/* TODO Fix this css */
const DistributorLandingPage = () => (
  <div className="flex w-full mx-auto">
    <div className="w-5/12 self-center">
      <Title fontSize="3xl" className="font-black leading-tighter">
        Welcome to the Trace Distributor Pilot
      </Title>
      
      <Copy className="my-6 " fontSize="md">
        <p className="mb-3">
          This is your official Trace tool for managing and productizing your hemp. Log in using the same credentials that you use to log into the Trace iOS app.
        </p>
      </Copy>

      <Button 
        type="link"
        to="/login/" 
        color="green"
        size="xl"
        className="inline-block"
      >
        Login
      </Button>
    </div>

    <div className="w-7/12 self-right">
      <div className="pl-16">
        <img src="/img/cropped/home.png" alt="Welcome Illustration" />
      </div>
    </div>
  </div>
)

export default DistributorLandingPage