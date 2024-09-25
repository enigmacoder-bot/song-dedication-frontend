import React, { useState } from 'react';

const RevealCard = ({ value }) => {
    const [revealed, setRevealed] = useState(false);

    const revealText = () => {
        setRevealed(true);
    };

    return (
        <span 
            className="relative cursor-pointer inline-flex items-center justify-center" 
            onClick={revealText}
        >
            {/* Black overlay block */}
            <div 
                className={`absolute inset-0 bg-black transition-opacity duration-500 rounded-md ${revealed ? 'opacity-0' : 'opacity-100'}`}
            ></div>

            {/* Hidden text */}
            <span 
                className={`text-white ${revealed ? 'hidden' : 'inline'} text-[1.2em] sm:text-[1.2em] md:text-[1.4em] lg:text-[1.6em]`}
            >
                [Hidden]
            </span>

            {/* Revealed text */}
            <span 
                className={`text-white ${revealed ? 'inline' : 'hidden'} text-[1.2em] sm:text-[1.2em] md:text-[1.4em] lg:text-[1.6em]`}
            >
                {value}
            </span>
        </span>
    );
};

export default RevealCard;
