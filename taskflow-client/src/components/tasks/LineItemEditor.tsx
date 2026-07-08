import React, { useState, useEffect, useRef } from 'react';
import { Circle, CheckCircle2, GripVertical, X } from 'lucide-react';

export interface LineItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface LineItemEditorProps {
  value: string; // The raw description string (could be JSON or plain text)
  onChange: (newValue: string) => void;
  disabled?: boolean;
}

export const LineItemEditor: React.FC<LineItemEditorProps> = ({ value, onChange, disabled }) => {
  const [items, setItems] = useState<LineItem[]>([]);
  const [isLegacyText, setIsLegacyText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parse value on mount
    if (!value) {
      setItems([{ id: crypto.randomUUID(), text: '', isCompleted: false }]);
      return;
    }
    
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].hasOwnProperty('text')) {
        setItems(parsed);
        setIsLegacyText(false);
      } else {
        throw new Error("Not a line item array");
      }
    } catch {
      // Legacy raw text - convert to single item
      setItems([{ id: crypto.randomUUID(), text: value, isCompleted: false }]);
      setIsLegacyText(true);
    }
  }, []);

  const notifyChange = (newItems: LineItem[]) => {
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  const handleTextChange = (id: string, text: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, text } : item);
    notifyChange(newItems);
  };

  const toggleComplete = (id: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item);
    notifyChange(newItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, id: string) => {
    const inputs = containerRef.current?.querySelectorAll('input[type="text"]');
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const newItem = { id: crypto.randomUUID(), text: '', isCompleted: false };
      const newItems = [...items];
      newItems.splice(index + 1, 0, newItem);
      notifyChange(newItems);
      
      // Focus new input
      setTimeout(() => {
        const updatedInputs = containerRef.current?.querySelectorAll('input[type="text"]');
        if (updatedInputs && updatedInputs[index + 1]) {
          (updatedInputs[index + 1] as HTMLInputElement).focus();
        }
      }, 10);
    } 
    else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) {
      e.preventDefault();
      const newItems = items.filter(item => item.id !== id);
      notifyChange(newItems);
      
      // Focus previous input
      setTimeout(() => {
        const updatedInputs = containerRef.current?.querySelectorAll('input[type="text"]');
        if (updatedInputs && updatedInputs[index - 1]) {
          const prevInput = updatedInputs[index - 1] as HTMLInputElement;
          prevInput.focus();
          prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
        }
      }, 10);
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (inputs && inputs[index - 1]) {
        const prevInput = inputs[index - 1] as HTMLInputElement;
        prevInput.focus();
        // optionally keep cursor position or move to end
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (inputs && inputs[index + 1]) {
        const nextInput = inputs[index + 1] as HTMLInputElement;
        nextInput.focus();
      }
    }
  };

  const removeLine = (id: string) => {
    if (items.length === 1) {
      notifyChange([{ id: crypto.randomUUID(), text: '', isCompleted: false }]);
      return;
    }
    notifyChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2 group">
          <button
            type="button"
            disabled={disabled}
            onClick={() => toggleComplete(item.id)}
            className="flex-shrink-0 text-slate-400 hover:text-blue-500 transition-colors"
          >
            {item.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          
          <input
            type="text"
            value={item.text}
            onChange={(e) => handleTextChange(item.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index, item.id)}
            disabled={disabled}
            placeholder={index === 0 ? "e.g. Vertical Pull → 4 sets 15 reps" : "New line item..."}
            className={`w-full bg-transparent border-b border-transparent focus:border-slate-200 dark:focus:border-slate-700 outline-none py-1 text-sm transition-all ${
              item.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'
            }`}
          />
          
          <button
            type="button"
            onClick={() => removeLine(item.id)}
            disabled={disabled}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default LineItemEditor;
