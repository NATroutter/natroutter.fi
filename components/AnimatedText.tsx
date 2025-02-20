import React, {JSX, useEffect, useState} from "react";

export default function AnimatedText({ words, writeSpeed, earseSpeed, pauseTime } : {words: string[], writeSpeed:number, earseSpeed:number, pauseTime:number}) : JSX.Element {
	const [currentWord, setCurrentWord] = useState<number>(0);
	const [text, setText] = useState<string>("");
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [speed, setSpeed] = useState<number>(writeSpeed);
	const [index, setIndex] = useState<number>(0);

	useEffect(() => {
		const handleTextAnimation = () => {
			const currentText = words[currentWord];

			if (isDeleting) {
				// Erasing text
				setText((prev) => prev.slice(0, prev.length - 1));
				setSpeed(earseSpeed);
			} else {
				// Typing text
				setText(currentText.slice(0, index + 1));
				setSpeed(writeSpeed);
			}

			if (!isDeleting && index === currentText.length) {
				setSpeed(pauseTime); // Pause after finishing the word
				setIsDeleting(true);
			} else if (isDeleting && index === 0) {
				setIsDeleting(false);
				setCurrentWord((prev) => (prev + 1) % words.length);
			}

			if (!isDeleting) {
				setIndex((prev) => prev + 1);
			} else {
				setIndex((prev) => prev - 1);
			}
		};

		const timer = setInterval(handleTextAnimation, speed);
		return () => clearInterval(timer);
	}, [index, isDeleting, currentWord, speed, words, earseSpeed, writeSpeed, pauseTime]);

	return (<span className="text-theme">{text}</span>);
};