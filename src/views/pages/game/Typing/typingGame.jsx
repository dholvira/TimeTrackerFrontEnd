import React, { useState } from 'react';
import logo from '../../../../assets/img/brand/bb.png';
import useKeyPres from './userKeyPress';
import { generate } from './words';
import { currentTime } from './time';

import './typingGame.css';

const initalWords = generate();

function TypingGame() {
  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(' ').join('')
  );

  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState(initalWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initalWords.substr(1));

  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);

  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState('');

  useKeyPres((key) => {
    //Set the startTime when the user starts typing the first character
    if (!startTime) {
      setStartTime(currentTime());
    }
    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;

    //check if user hits correct keystroke
    if (key === currentChar) {
      if (leftPadding.length > 0) {
        //Reduce the leftPadding by one character. This condition will be true for the first 20 correct keystrokes
        setLeftPadding(leftPadding.substring(1));
      }

      //Append the currentChar to outgoingChars.
      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      //Update the currentChar with the first character of incomingChars
      setCurrentChar(incomingChars.charAt(0));
      //Rmove the first character from incomingChars
      updatedIncomingChars = incomingChars.substring(1);
      //Check if the incomingChars still has enough words.
      // If not, replenish 10 or more new words with generate function.
      if (updatedIncomingChars.split(' ').length < 10) {
        updatedIncomingChars += ' ' + generate();
      }
      setIncomingChars(updatedIncomingChars);
      //Recalculate WPM when the user is about to finish the word.
      // we check on whether the next character to type is a white space
      if (incomingChars.charAt(0) === ' ') {
        // Increase word count.
        setWordCount(wordCount + 1);
        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }
    }
    const updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);
    setAccuracy(
      ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(
        2
      )
    );
  });

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p className='Character'>
          <span className='Character-out'>
            {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span className='Character-current'>{currentChar}</span>
          <span>{incomingChars.substr(0, 20)}</span>
        </p>
        <h3 className='Result-header'>
          WPM: {wpm} | ACC: {accuracy}%
        </h3>
        {/* <span>
          <a
            className='App-link'
            // href=''
            target='_blank'
            rel='noopener noreferrer'
          >
            Medium
          </a>
          |
          <a
            className='App-link'
            // href=''
            target='_blank'
            rel='noopener noreferrer'
          >
            Github
          </a>
        </span> */}
        <h4 className='info'>
          {' '}
          Start typing to check your speed and accuracy..
        </h4>
      </header>
    </div>
  );
}

export default TypingGame;
