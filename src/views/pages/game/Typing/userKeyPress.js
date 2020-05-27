//ref https://usehooks.com/useKeyPress/:
import { useState, useEffect } from 'react';

//Passing a callback as a parameter to perform logic inside this callback.
const useKeyPress = (callback) => {
  //Call the useState hook to create a state for the pressed key. Every time a key is pressed,
  // we call setKeyPressed to update the current key.
  const [keyPressed, setKeyPressed] = useState();
  //performing key update operations inside useEffect.
  useEffect(() => {
    //Inside downHandler, handler when a key is down, we only update the key pressed based on two conditions.
    // First, check whether it is a different key to prevent registering the same key stoke when the user holds the key for too long.
    // Second, check whether it is a single character key, i.e. not CTRL, Shift, Esc, Delete, Return, Arrow, etc.
    const downHandler = ({ key }) => {
      if (keyPressed !== key && key.length === 1) {
        setKeyPressed(key);
        callback && callback(key);
      }
    };
    //Inside upHandler, which is the handler when a key is up (released),
    // set the current key state to null. This is to make it work nicely with downHandler.
    const upHandler = () => {
      setKeyPressed(null);
    };

    //Register the handlers with the browser’s window.
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      //At the end of useEffect, return a function that does the cleanup. In this case,
      // deregister the handlers with the browser’s window.
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });
  //Return the keyPressed state to the caller. we don’t have to use this return value.
  return keyPressed;
};

export default useKeyPress;
