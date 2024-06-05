// @/pages/index.js
import React from 'react'
import HomePage from '../components/HomeComponent'

import styled from 'styled-components';
import { signIn } from "next-auth/react";

const Container = styled.div`
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Card = styled.div`
  width: 600px;
  padding: 32px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-color: white;
  font-size: x-large;
`;

const Imagen = styled.div`
  background-image: url('/personas.PNG');
`;

const TabContent = styled.div`
  display: none;

  &.active {
    display: block;
  }
`;


export default function IndexPage() {

    return (
        <Container>
          <Card>
            <h2>About us</h2>
            
            More than an app, we are part of your life, we help you with your time!! Managing time is not just a matter of organizing hours and minutes, but of valuing each moment as an unrepeatable opportunity to achieve our dreams, improve our skills and build a full and balanced life. Taking advantage of every second with purpose and determination is the key to transforming our goals into realities, our aspirations into tangible achievements and our daily lives.            <img src="personas.PNG" />
            <Imagen>

            </Imagen>
            
          </Card>
        </Container>
      );
}
