import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface SpringNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const SpringNumber: React.FC<SpringNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 1,
  className = ''
}) => {
  const spring = useSpring(0, {
    stiffness: 45,
    damping: 18,
    mass: 0.8
  });

  const [displayValue, setDisplayValue] = useState(`${prefix}0.0${suffix}`);

  const formatted = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return formatted.on('change', (latest) => {
      setDisplayValue(latest);
    });
  }, [formatted]);

  return <span className={className}>{displayValue}</span>;
};
