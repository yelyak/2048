"use client";
import Image from "next/image";
import Board from "./Components/Board";
import React, {useState} from "react";
import {useEffect} from "react";

//store top score in local storage when the list has updates


export default function Home() {
  const TIME_LEFT = 60
  
  const createInitialBoard = () => {
    const board = [];
    for (let i = 0 ; i < 4 ; i++){
      board.push(Array(4).fill(null))
    }
    addNewTile(board);
    addNewTile(board);
    return board;
  };

  const addNewTile = (board) => {
    const emptyTile = [];
    for (let i = 0 ; i < board.length ; i++){
      for (let j = 0 ; j < board[0].length; j++){
        if (board[i][j] === null){
          emptyTile.push({i,j});
      }
    }
  }
  if (emptyTile.length > 0){
    const {i, j}= emptyTile[Math.floor(Math.random() * emptyTile.length)];
    board[i][j] = 2;
  }
  return board; 
 };


 const moveUp = () => {
  const newBoard = [...board];

  const originalBoardString = JSON.stringify(newBoard);

  for (let col = 0; col < 4; col++){
    let newCol = newBoard
      .map((row) => row[col])
      .filter((val) => val !== null);
    for (let row = 0; row < newCol.length -1; row++){
      if (newCol[row] === newCol[row+1]){
        newCol[row] *= 2;
        setScore(score + newCol[row]);
        newCol.splice(row +1, 1);

      }
    }
    while (newCol.length < 4){
      newCol.push(null);
    }
    for (let row = 0; row < 4; row++){
      newBoard[row][col] = newCol[row];
    }
  }
  const newBoardString = JSON.stringify(newBoard);
  if (newBoardString === originalBoardString){
    return;
  }
  const updatedBoard = addNewTile(newBoard);
  setBoard(updatedBoard);
}

 const moveDown = () => {
  

  const newBoard = [...board];
  const originalBoardString = JSON.stringify(newBoard);
  for (let col = 0; col < 4; col++){
    let newCol = newBoard
      .map((row) => row[col])
      .filter((val) => val !== null);
    for (let row = newCol.length - 1; row > 0; row--){
      if (newCol[row] === newCol[row-1]){
        newCol[row] *= 2;
        setScore(score + newCol[row]);
        newCol.splice(row -1, 1);
        row--;
      }
    }
    while (newCol.length < 4){
      newCol.unshift(null);
    }
    for (let row = 0; row < 4; row++){
      newBoard[row][col] = newCol[row];
    }
  }
  const newBoardString = JSON.stringify(newBoard);
  if (newBoardString === originalBoardString){
    return;
  }
  const updatedBoard = addNewTile(newBoard);
  setBoard(updatedBoard);
 }

 const moveLeft = () => {
  const newBoard = [...board];
  const originalBoardString = JSON.stringify(newBoard);

  for (let row = 0; row < 4; row++) {
    let newRow = newBoard[row].filter((val) => val !== null);
    for (let col = 0; col < newRow.length - 1; col++) {
      if (newRow[col] === newRow[col + 1]) {
        newRow[col] *= 2;
        setScore(score + newRow[col]);
        newRow.splice(col + 1, 1);
        col++;
      }
    }
    while (newRow.length < 4) {
      newRow.push(null);
    }
    newBoard[row] = newRow;
  }
  const newBoardString = JSON.stringify(newBoard);
  if (newBoardString === originalBoardString){
    return;
  }
  const updatedBoard = addNewTile(newBoard);
  setBoard(updatedBoard);
};

const moveRight = () => {
  const newBoard = [...board];
  const originalBoardString = JSON.stringify(newBoard);

  for (let row = 0; row < 4; row++) {
    let newRow = newBoard[row].filter((val) => val !== null);
    for (let col = newRow.length - 1; col > 0; col--) {
      if (newRow[col] === newRow[col - 1]) {
        newRow[col] *= 2;
        setScore(score + newRow[col]);
        
        newRow.splice(col - 1, 1);
        col--;
      }
    }
    while (newRow.length < 4) {
      newRow.unshift(null);
    }
    newBoard[row] = newRow;
  }
  const newBoardString = JSON.stringify(newBoard);
  if (newBoardString === originalBoardString){
    return;
  }
  const updatedBoard = addNewTile(newBoard);
  setBoard(updatedBoard);
};


 const [board, setBoard] = useState(createInitialBoard());
 const [score, setScore] = useState(0);
 const [isTimeAttack, setIsTimeAttack] = useState(false);
 const [gameover, setGameover] = useState(false);
 const [topScores, setTopScores] = useState(() => {
  if (typeof window !== "undefined"){
    return JSON.parse(localStorage.getItem('topScores')) || [];
  }
  return [];
 });
 const [timeAttackScores, setTimeAttackScores] = useState(() => {
  if (typeof window !== "undefined"){
    return JSON.parse(localStorage.getItem('timeAttackScores')) || [];
  }
  return [];
 });
 const [nameInput, setNameInput] = useState("");
 const [showInput, setShowInput] = useState(false);
 const [timeLeft, setTimeLeft] = useState(TIME_LEFT);

 useEffect(() => {
  window.addEventListener("keydown", handleKeyDown);
  if (checkGameOver()){
    setGameover(true);
    if (!isTimeAttack){
      //console.log("least score:" + topScores[topScores.length - 1].score < score);
      //console.log("current score" +score);
      if (topScores.length < 10 || topScores[topScores.length - 1].score < score){
        setShowInput(true);
      }
    }else{

      if (timeAttackScores.length < 10 || timeAttackScores[timeAttackScores.length - 1].score < score){
        setShowInput(true);
      }
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);}
  };
},[board]);

 useEffect(() => {
  let timer;
  if (isTimeAttack && !gameover && timeLeft > 0){
    timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000)
  }else if (timeLeft === 0){
    setGameover(true);
  }
  return () => clearInterval(timer);
 }, [isTimeAttack, timeLeft, gameover])

 
 useEffect(() => {
  if (typeof window !== "undefined"){
    localStorage.setItem('topScores', JSON.stringify(topScores));
  }
  }, [topScores]);

useEffect(() => {
  if (typeof window !== "undefined"){
    localStorage.setItem('timeAttackScores', JSON.stringify(timeAttackScores));
  }
}, [timeAttackScores]);


 const handleKeyDown = (event) => {
  if (event.key === "ArrowUp"){
    moveUp();
  }
  if (event.key === "ArrowDown"){
    moveDown();
  }
  if (event.key === "ArrowLeft"){
    moveLeft();
  }
  if (event.key === "ArrowRight"){
    moveRight();
  }

};

const retry = () => {
  setBoard(createInitialBoard());
  setScore(0);
  setGameover(false);
  setShowInput(false);
};

const checkGameOver = () => {
  for (let row = 0 ; row < board.length ; row++){
    for (let col = 0 ; col < board[0].length; col++){
      if (board[row][col] === null){
        return false
    }
    if ((col < 3 && board[row][col] === board[row][col + 1]) || 
    (row < 3 && board[row][col] === board[row + 1][col]) ){
      return false;
    }
  }
  
}
return true;
};

const handleNameChange = (event) => {
  setNameInput(event.target.value);
}

const submitScore= () => {
  if(nameInput.trim() !=""){
    const newTAScores = isTimeAttack ? [...timeAttackScores] : [...topScores];
    newTAScores.push({name: nameInput, score: score});
    newTAScores.sort((a,b) => b.score - a.score);
    newTAScores.splice(10);
    setNameInput("");
    setShowInput(false);

    if (isTimeAttack) {
      setTimeAttackScores(newTAScores);
    } else {
      setTopScores(newTAScores);
    }

  }
}

const handleTimeAttackClick = () => {
  //check if it is true   vv
  setIsTimeAttack(true);
  setTimeLeft(60);
  retry()
}

const handleNormalModeClick = () => {
  setIsTimeAttack(false);
  retry()
}
// own rules, random spawn values 

return (
  <main className="game-container">
        <header className="header">
            <h1 className="title">2048</h1>
            <div className="score-container">
                <div className="score-box">SCORE</div>
                <div className="score-value">{score}</div>
            </div>
            {isTimeAttack && (
                <div className="timer-container">
                    <div className="timer-box">TIME LEFT</div>
                    <div className="timer-value">{timeLeft}</div>
                </div>
            )}
        </header>
        <div className="game-board-container">
            <Board board={board}/>
            <div className="scoreboard-container">
                <h2 className="scoreboard-title">Leaderboard</h2>
                <ul className="scoreboard">
                  {(isTimeAttack ? timeAttackScores : topScores).map((score, index) => (
                    <li key={index}>
                        <div className="scoreboard-item">
                            <span className="scoreboard-name">{score.name}</span>
                            <span className="scoreboard-score">{score.score}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        {!isTimeAttack && (
            <button className="time-attack-button" onClick={handleTimeAttackClick}>
                Time Attack Mode
            </button>
        )}
        {isTimeAttack && (
            <button className="normal-mode-button" onClick={handleNormalModeClick}>
                Normal Mode
            </button>
        )}
        {showInput && (
            <div className="name-input-container">
                <input
                    type="text"
                    className="name-input"
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={handleNameChange}
                />
                <button className="submit-button" onClick={submitScore}>
                    Submit
                </button>
            </div>
        )}
        {gameover && (
            <button className="retry-button" onClick={retry}>
            Retry
            </button>
        )}
      </main>
);
}



// timeattack mode leaderboard when pressed (key
//filter with game mode (if timeattackmode () => {
// local.storage new list (timeattack scores) )})
// debug