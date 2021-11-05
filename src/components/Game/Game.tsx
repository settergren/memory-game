import React, { FC, ReactElement, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Game.scss';

import Button from '@material-ui/core/Button';
import { clearInterval } from 'timers';

/**
 * Class that represents a game tile
 */
class Tile {
  constructor(public key: string = uuidv4(),
              public target: boolean = false,
              public clicked: boolean = false) {}
}

/**
 * Memory Game Component
 * @returns {ReactElement}
 */
const Game: FC<any> = (): ReactElement => {
  
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>('0');

  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('Find all the matches!');
  const [gameOverMessage, setGameOverMessage] = useState<string>('');

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [missCount, setMissCount] = useState<number>(0);
  const [hitCount, setHitCount] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<number>(5);
  const [numTargets, setNumTargets] = useState<number>(5);
  const [tileSize, setTileSize] = useState<number>(100 / 5);
  const [numTiles, setNumTiles] = useState<number>(25);
  const [showTargets, setShowTargets] = useState<boolean>(false);

  let timerInterval: any;

  /**
   * Build new set of tiles with random targets
   */
  const buildTiles = () => {
    // Build array with desired number of tiles
    const newTiles = [];
    for (let index = 0; index < numTiles; index++) {
      newTiles.push(new Tile());
    }
    // Loop through the number of desired targets, randomly assigning to tiles
    for (let index = 0; index < numTargets; index++) {
      // Get the tiles that are not yet targets
      const availTiles = newTiles.filter(tile => !tile.target);
      // Randomly select one of the available tiles
      const randomIndex = Math.round(Math.random() * (availTiles.length - 1));
      // Mark this tile as a target
      availTiles[randomIndex].target = true;
    }
    setTiles(newTiles);
  };
  /**
   * Start a new game
   */
  const startGame = () => {
    buildTiles();
    setElapsedTime('0');
    setStartTime(new Date().getTime());
    setCurrentTime(new Date().getTime());
    setMissCount(0);
    setHitCount(0);
    setGameOver(false);
    setGameMessage('Watch the tiles!');

    // Show the targets to the user
    setTimeout(() => setShowTargets(true), 1000);
    setTimeout(() => {
      setShowTargets(false);
      setGameActive(true);
      // Start the timer once the preview is gone
      clearInterval(timerInterval);
      timerInterval = setInterval(() => setCurrentTime(new Date().getTime()), 1000);
    }, 2000);
  };

  /**
   * Play a new game at the next level
   */
  const nextLevel = () => {
    setDifficulty(difficulty + 1);
    startGame();
  };

  /**
   * End the current game
   */
  const endGame = () => {
    clearInterval(timerInterval);
    setGameActive(false);
    setGameOver(true);
  };

  /**
   * Build a game over message that should show the end results.
   */
  const buildGameOverMessage = () => {
    // Determine the missed percentage of the total tiles
    const notFound = tiles.filter(tile => tile.target && !tile.clicked).length;
    const notFoundPercent = notFound / numTargets;
    const missPercent = (missCount) / numTiles;

    const score = Math.max(missPercent, notFoundPercent);
    
    // Build a fun explamation based off how well the user played
    let exclamation = '';
    if (score === 0) exclamation = 'Perfect!';
    else if (score < 0.05) exclamation = 'Great Job!';
    else if (score < 0.10) exclamation = 'Good Job!';
    else if (score < 0.25) exclamation = 'Not bad.';
    else if (score < 0.5) exclamation = 'Meh.';
    else if (score < 0.75) exclamation = 'Ouch!';
    else exclamation = 'Yikes!';
    setGameOverMessage(`${exclamation} You had ${hitCount} hits and ${missCount} misses in ${elapsedTime}.`);
  };

  /**
   * Handle tile clicks by marking tile as clicked.
   * @param {Tile} tile 
   */
  const clickTile = (tile: Tile) => {
    // Do not allow clicks while game is not active or while showing targets
    if (gameActive && !showTargets) {
      tile.clicked = true;
      setTiles([...tiles]);
    }
  };

  /**
   * Get the className for a given tile based off the current state of the game and the
   * current state of the tile.
   * @param {Tile} tile 
   * @returns {string} The tile className
   */
  const getTileClasses = (tile: Tile): string => {
    let classes = 'tile';
    if (showTargets && tile.target) classes += ' revealed'
    if (tile.clicked) {
      classes += tile.target ? ' hit' : ' miss';
    }
    if (gameOver && tile.target && !tile.clicked) {
      classes += ' revealed';
    }
    return classes;
  };

  // Update the game score state as the tiles are updated
  useEffect(() => {
    const misses = tiles.filter(tile => tile.clicked && !tile.target);
    const hits = tiles.filter(tile => tile.clicked && tile.target);
    setMissCount(misses.length);
    setHitCount(hits.length);

    if (hits.length === numTargets) {
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  // Update game state based of changes to desired difficulty
  useEffect(() => {
    // The number of targets matches the difficulty level
    setNumTargets(difficulty);
    // The number of tiles is the square of the difficulty
    setNumTiles(difficulty * difficulty);
    // The tile size should be a percentage of 100 bassed off the number of tiles per side
    setTileSize(100 / difficulty);
    // Reset game state
    setGameOver(false);
    setGameActive(false);
  }, [difficulty]);

  // Rebuild the tiles as the desired number of tiles is changed
  useEffect(()=> {
    buildTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numTiles, numTargets]);

  useEffect(() => {
    buildGameOverMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  useEffect(() => {
    const millis = currentTime - startTime;
    const seconds = Math.round(millis / 1000);
    setElapsedTime(`${seconds} seconds`);
  }, [startTime, currentTime]);

  useEffect(() => {
    if (gameActive) {
      setGameMessage(`${hitCount} out of ${numTargets} with ${missCount} misses in ${elapsedTime}!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameActive, missCount, hitCount, elapsedTime]);

  return (
    <div className={`game-container ${gameActive ? 'game-active' : ''} ${showTargets ? 'show-targets' : ''}`}>
      <h1>Memory Game</h1>

      <div className="game-bar">
        <label htmlFor="difficulty">Level: { difficulty } </label>
        <input id="difficulty" type="range" min="2" max="20" disabled={gameActive} value={difficulty} onChange={e => setDifficulty(parseInt(e.target.value))} />
        <Button variant="contained" color="primary" disabled={gameActive} onClick={() => startGame()}>Play</Button>
      </div>

      {!gameOver &&
        <h2>
          {gameMessage}&nbsp;
          {gameActive && <Button variant="contained" color="primary" onClick={() => endGame()}>End Game</Button>}
        </h2>
      }
      {gameOver && <h2>{gameOverMessage} <Button variant="contained" color="primary" onClick={() => nextLevel()}>Next Level!</Button></h2>}

      <div className="tiles">
        {
          tiles.map((tile, index) =>
            <div key={tile.key} className="tile-container" style={{width: `${tileSize}%`, height: `${tileSize}%`}}>
              <div className={getTileClasses(tile)} onClick={() => clickTile(tile)}></div>
            </div>)
        }
      </div>
    </div>
  );
};

export default Game;
