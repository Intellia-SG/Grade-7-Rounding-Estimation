import React, { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration, sounds } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';
import { STORY_SLIDES } from '../data/storyContent';
import EstimateCompareBar from './shared/EstimateCompareBar';

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const narrationRef = useRef(null);

  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;

  // Preload narration
  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) {
        preloadNarration(getStoryNarration(slide + 1));
      }
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false);
    setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    sounds.click();
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => {
      if (isLast) {
        onComplete();
      } else {
        setSlide(i => i + 1);
      }
      setAnim(false);
    }, 300);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    sounds.click();
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => {
      setSlide(i => i - 1);
      setAnim(false);
    }, 300);
  }, [anim, slide]);

  return (
    <div className="story-phase-container">
      {/* Main 2-Column Story Card */}
      <div className={`story-modal-card ${anim ? 'flipping' : ''}`}>
        {/* Left Column: Visual Artwork / Diagram */}
        <div className="story-modal-visual">
          {/* Location Badge */}
          {s.locationTag && (
            <div className="story-location-badge">
              {s.locationTag}
            </div>
          )}

          {s.diagramType === 'roundingSum' ? (
            <div style={{ padding: 24, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(180deg, #10103e, #1a1a55)' }}>
              <EstimateCompareBar
                exactLabel="Exact Total"
                exactValue={36.35}
                estimateLabel="Estimated Total"
                estimateValue={36.00}
                unit="$"
                items={[
                  { name: "Backpack", price: 18.75, rounded: 19 },
                  { name: "Notebook", price: 6.40, rounded: 6 },
                  { name: "Art Kit", price: 11.20, rounded: 11 },
                ]}
              />
            </div>
          ) : s.image ? (
            <img
              src={s.image}
              alt={s.title}
              className="story-modal-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}
        </div>

        {/* Right Column: Narrative Text, Highlight & Navigation */}
        <div className="story-modal-body">
          {/* Title */}
          <h2 className="story-modal-title">
            {s.title}
          </h2>

          {/* Story Paragraph */}
          <p className={`story-modal-text ${textVis ? 'revealed' : ''}`}>
            {s.text}
          </p>

          {/* Pedagogical Callout Capsule */}
          <div className={`story-callout-pill ${hlVis ? 'visible' : ''}`}>
            {s.highlight}
          </div>

          {/* Bottom Navigation Controls Row */}
          <div className="story-modal-controls">
            {/* Prev Button */}
            <button
              className="story-nav-btn-prev"
              onClick={goPrev}
              disabled={slide === 0}
              style={{ opacity: slide === 0 ? 0.35 : 1, cursor: slide === 0 ? 'not-allowed' : 'pointer' }}
            >
              ← Prev
            </button>

            {/* Segmented Dots Indicator + Counter */}
            <div className="story-dots-wrapper">
              <div className="story-dots-indicators">
                {STORY_SLIDES.map((_, i) => (
                  <span
                    key={i}
                    className={`story-bar-dot ${i === slide ? 'active-bar' : i < slide ? 'done-dot' : 'pending-dot'}`}
                  />
                ))}
              </div>
              <span className="story-counter-label">{slide + 1} / {STORY_SLIDES.length}</span>
            </div>

            {/* Next Button */}
            <button
              className="story-nav-btn-next"
              onClick={goNext}
              id="story-next-btn"
              aria-label={isLast ? "Proceed to Simulate Phase" : "Next Story Panel"}
            >
              {isLast ? "🚀 Let's Simulate! →" : "Next Panel →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
