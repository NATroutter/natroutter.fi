import { useEffect, useState } from 'react';

type WindowDimentions = {
	width: number;
	height: number;
};

const useWindowDimensions = (): WindowDimentions => {
	const [windowDimensions, setWindowDimensions] = useState<WindowDimentions>({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	});
	useEffect(() => {
		function handleResize(): void {
			setWindowDimensions({
				width: window?.innerWidth ?? 0,
				height: window?.innerHeight ?? 0,
			});
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return (): void => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount

	return windowDimensions;
};

export default useWindowDimensions;