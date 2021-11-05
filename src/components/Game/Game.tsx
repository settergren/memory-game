import React, { FC, ReactElement, useEffect, useState } from 'react';
import './Game.scss';

import Button from '@material-ui/core/Button';

class Tile {
  constructor(public index: number, public target: boolean, public clicked: boolean) {}
}

const Game: FC<any> = (): ReactElement => {
  
  
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [difficulty, setDifficulty] = useState<number>(5);
  const [numTiles, setNumTiles] = useState<number>(25);
  const [showTargets, setShowTargets] = useState<boolean>(false);

  const resetGame = () => {
    buildTiles();
  }

  const buildTiles = () => {
    const newTiles = [];
    for (let index = 0; index < numTiles; index++) {
      newTiles.push({index, target: false, clicked: false});
    }
    setTiles(newTiles);
  };

  const assignTargets = () => {
    for (let index = 0; index < difficulty; index++) {
      const randomIndex = Math.round(Math.random() * numTiles);
      const tile = tiles[randomIndex];
      if (tile) {
        tile.target = true;
      }
    }
    setTiles([...tiles]);
  }

  const showTargetsToUser = () => {
    setShowTargets(true);
    setTimeout(() => {
      setShowTargets(false);
    }, 1500);
  };

  const startGame = () => {
    resetGame();
    assignTargets();
    showTargetsToUser();
  };

  const clickTile = (tile: Tile) => {
    tile.clicked = true;
  };

  useEffect(() => {
    setNumTiles(difficulty * difficulty);
  }, [difficulty]);

  useEffect(()=> {
    resetGame();
  }, [numTiles]);

  return (
    <div className="game-container">
      <h1>Memory Game</h1>

      <div>
        <label htmlFor="difficulty">Difficulty: { difficulty } </label>
        <input id="difficulty" type="range" min="2" max="20" value={difficulty} onChange={e => setDifficulty(parseInt(e.target.value))} />
      </div>
      
      <Button variant="contained" color="primary" onClick={startGame}>Play</Button>

      <div className="tile-container">
        {
          tiles.map(tile => <div className={`tile ${showTargets && tile.target ? 'show-target' : ''}`} onClick={() => clickTile(tile)}></div>)
        }
      </div>
    </div>
  );
};

export default Game;
