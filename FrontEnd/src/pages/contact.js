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

const icons = styled.div`
  display: none;

  &.active {
    display: block;
  }
`;

export default function IndexPage() {

    return (
        <Container>
          <Card>

            <h1>Find us in:</h1>
            <p>
            Mail: services@planahead.com <br/>
            Phone: 83594798
            </p>
            <icons>
            <img src="facebook.jpg" width="50"/> PlanAhead
            <img src="insta.PNG" width="40"/>PlanAhead
            </icons>
            
            <Imagen>

            </Imagen>
            
          </Card>
        </Container>
      );
}
