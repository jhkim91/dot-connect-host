import React from 'react';
import styled from 'styled-components';
import Board from './Board';
import Controls from './Controls';
import GameStatus from './GameStatus';
import { GameProvider } from '../context/GameContext';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2196F3;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Game: React.FC = () => {
  return (
    <GameProvider>
      <GameContainer>
        <Title>Dot Connect</Title>
        <Controls />
        <Board />
        <GameStatus />
      </GameContainer>
    </GameProvider>
  );
};

export default Game; 