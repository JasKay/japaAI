'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Slide = {
  title?: string;
  className?: string;
  content: React.ReactNode;
};

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      className: 'title-slide',
      content: (
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '5rem',
              marginBottom: '30px',
            }}
          >
            ALIOV
          </h1>

          <p
            style={{
              fontSize: '2rem',
              marginBottom: '20px',
              opacity: 0.9,
            }}
          >
            Move Anywhere with Confidence
          </p>

          <p
            style={{
              fontSize: '1.3rem',
              opacity: 0.8,
            }}
          >
            No agents. No confusion. Just clarity.
          </p>

          <p
            style={{
              marginTop: '40px',
              opacity: 0.7,
            }}
          >
            Relocation guidance for the 250M people who want to move
          </p>
        </div>
      ),
    },

    {
      title: 'THE PROBLEM',
      className: 'problem-slide',
      content: (
        <>
          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            250 million people want to relocate internationally.
          </p>

          <ul
            style={{
              lineHeight: 2,
              paddingLeft: '20px',
            }}
          >
            <li>Overwhelming complexity</li>
            <li>Fragmented information</li>
            <li>High relocation costs</li>
            <li>Long uncertainty timelines</li>
            <li>High visa rejection rates</li>
          </ul>

          <p
            style={{
              marginTop: '20px',
              fontWeight: 700,
              color: '#6D28D9',
            }}
          >
            No one is making relocation simple, structured, and affordable.
          </p>
        </>
      ),
    },

    {
      title: 'MARKET OPPORTUNITY',
      className: 'market-slide',
      content: (
        <>
          <div
            style={{
              fontSize: '4rem',
              fontWeight: 900,
              color: '#6D28D9',
              marginBottom: '10px',
            }}
          >
            $500B+
          </div>

          <p
            style={{
              marginBottom: '30px',
            }}
          >
            Global migration market annually
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div className="box">
              <h3>Core Market</h3>

              <p>17M+ study visas yearly</p>
              <p>85M+ skilled migration</p>
              <p>150M+ relocation intent</p>
            </div>

            <div className="box">
              <h3>Beachhead</h3>

              <p>Africa → UK/Canada/USA</p>
              <p>$30B serviceable market</p>
            </div>
          </div>
        </>
      ),
    },

    {
      title: 'THE SOLUTION',
      className: 'solution-slide',
      content: (
        <>
          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '30px',
              color: '#6D28D9',
            }}
          >
            AI-powered relocation operating system
          </p>

          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            {[
              'Input relocation goals',
              'Generate personalized pathway',
              'Execute with AI guidance',
            ].map((item, index) => (
              <div
                key={index}
                className="flow-box"
              >
                <div
                  style={{
                    fontSize: '2rem',
                    marginBottom: '10px',
                  }}
                >
                  {index + 1}
                </div>

                <p>{item}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') previousSlide();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [currentSlide]);

  return (
    <div className="deck-container">
      <div
        className={`slide ${slides[currentSlide].className || ''}`}
      >
        {slides[currentSlide].title && (
          <h2>{slides[currentSlide].title}</h2>
        )}

        {slides[currentSlide].content}

        <div className="slide-number">
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>

      <div className="controls">
        <button
          onClick={previousSlide}
          disabled={currentSlide === 0}
        >
          ← Previous
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
        >
          Next →
        </button>
      </div>

      <style jsx>{`
        .deck-container {
          min-height: 100vh;
          background: #f3f4f6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .slide {
          width: 100%;
          max-width: 1400px;
          aspect-ratio: 16 / 9;
          background: white;
          border-radius: 20px;
          padding: 60px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .title-slide {
          background: linear-gradient(
            135deg,
            #6d28d9 0%,
            #6366f1 100%
          );
          color: white;
        }

        .problem-slide {
          background: linear-gradient(
            135deg,
            #fef3c7 0%,
            #fed7aa 100%
          );
        }

        .market-slide {
          background: linear-gradient(
            135deg,
            #dbeafe 0%,
            #bae6fd 100%
          );
        }

        .solution-slide {
          background: linear-gradient(
            135deg,
            #e0e7ff 0%,
            #ddd6fe 100%
          );
        }

        h1,
        h2,
        h3 {
          margin: 0;
        }

        h2 {
          font-size: 3rem;
          margin-bottom: 30px;
        }

        .box {
          background: rgba(255, 255, 255, 0.8);
          padding: 20px;
          border-radius: 12px;
        }

        .flow-box {
          flex: 1;
          min-width: 220px;
          background: rgba(255, 255, 255, 0.85);
          padding: 25px;
          border-radius: 12px;
          text-align: center;
        }

        .controls {
          margin-top: 20px;
          display: flex;
          gap: 20px;
        }

        button {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          background: #6366f1;
          color: white;
          font-size: 1rem;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slide-number {
          position: absolute;
          bottom: 20px;
          right: 30px;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .slide {
            padding: 30px;
            aspect-ratio: auto;
            min-height: 80vh;
          }

          h1 {
            font-size: 3rem !important;
          }

          h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}