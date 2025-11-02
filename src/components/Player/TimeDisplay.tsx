import React from 'react';
import { formatTime } from '@/utils/formatTime';
import './TimeDisplay.css';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

/**
 * TimeDisplay Component
 * 
 * Displays current playback time and total duration in MM:SS format.
 * 
 * @param currentTime - Current playback position in seconds
 * @param duration - Total track duration in seconds
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, duration }) => {
  return (
    <div className="time-display">
      <span className="time-display__current">{formatTime(currentTime)}</span>
      <span className="time-display__divider">/</span>
      <span className="time-display__duration">{formatTime(duration)}</span>
    </div>
  );
};

export default TimeDisplay;