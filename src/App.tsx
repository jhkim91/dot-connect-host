import React from 'react';
import styled from 'styled-components';
import { GameProvider } from './context/GameContext';
import Board from './components/Board';
import Controls from './components/Controls';
import GameStatus from './components/GameStatus';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FAFAFA;
  padding: 20px;
`;

const GameContainer = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h1`
  color: #1976D2;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContainer>
        <GameContainer>
          <Title>Dot Connect</Title>
          <Controls />
          <Board />
          <GameStatus />
        </GameContainer>
      </AppContainer>
    </GameProvider>
  );
};

export default App;
