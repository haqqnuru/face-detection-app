import { useEffect } from "react";


// implements random gradient background
export function RandomGradientBackground() {
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getRandomGradient() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `linear-gradient(89deg, ${color1}, ${color2})`; // Left to right at 89 degress
  }

  useEffect(() => {
    document.body.style.background = getRandomGradient();
  },);

  return null; 
}
