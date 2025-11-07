"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  id?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, max = 100, min = 0, step = 1, id, ...props }, ref) => {
    const currentValue = value[0] || 0;
    
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      console.log(`🎛️ Slider ${id} changed to:`, newValue);
      onValueChange?.([newValue]);
    }, [id, onValueChange]);
    
    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          ref={ref}
          id={id}
          type="range"
          value={currentValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:w-5 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-primary
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:h-5 
                     [&::-moz-range-thumb]:w-5 
                     [&::-moz-range-thumb]:rounded-full 
                     [&::-moz-range-thumb]:bg-primary
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-primary
                     [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${currentValue}%, hsl(var(--secondary)) ${currentValue}%, hsl(var(--secondary)) 100%)`
          }}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
