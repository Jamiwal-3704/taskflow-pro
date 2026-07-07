import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import type { WorkoutTemplate } from '../../types/workout';
import type { TodoList } from '../../types/list';
import { X } from 'lucide-react';

interface NewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newList: TodoList) => void;
}

export const NewListModal: React.FC<NewListModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [colorHex, setColorHex] = useState('#3B82F6');
  const [listType, setListType] = useState<number>(0); // 0 = Todo, 1 = Workout
  const [workoutTemplateId, setWorkoutTemplateId] = useState('');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  const colors = [
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F97316', // Orange
  ];

  // Fetch templates when workout type is selected
  useEffect(() => {
    if (isOpen && listType === 1 && templates.length === 0) {
      setTemplatesLoading(true);
      api.get<WorkoutTemplate[]>(ENDPOINTS.WORKOUTS.TEMPLATES)
        .then((res) => {
          setTemplates(res.data);
          if (res.data.length > 0) {
            setWorkoutTemplateId(res.data[0].id);
          }
        })
        .catch((err) => console.error('Failed to fetch workout templates:', err))
        .finally(() => setTemplatesLoading(false));
    }
  }, [isOpen, listType, templates.length]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setNameError('');
      setListType(0);
      setWorkoutTemplateId('');
      setIsCollaborative(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateName = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return 'List name is required.';
    if (trimmed.length < 2) return 'At least 2 characters required.';
    if (trimmed.length > 50) return 'Max 50 characters allowed.';
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) return 'Only letters, numbers, spaces, hyphens, underscores.';
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (nameError) setNameError(validateName(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateName(name);
    if (error) { setNameError(error); return; }

    if (listType === 1 && !workoutTemplateId) {
      setNameError('Please wait for workout templates to load.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        colorHex,
        listType,
        workoutTemplateId: (listType === 1 && workoutTemplateId) ? workoutTemplateId : null,
        isCollaborative,
      };
      const response = await api.post<TodoList>(ENDPOINTS.LISTS.BASE, payload);
      onSuccess(response.data);
      onClose();
    } catch (error: any) {
      console.error('Failed to create list:', error);
      const serverMsg =
        error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : error?.response?.data
          ? typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data)
          : 'Failed to create list. Check your inputs.';
      setNameError(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle = { color: 'var(--text-muted)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.1em' };
  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)',
    backdropFilter: 'blur(8px)',
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl relative theme-bg-transition glass-panel"
        style={{ border: '1px solid var(--glass-border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Create New List
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--hover-bg)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* List Name */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>List Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={() => setNameError(validateName(name))}
              placeholder="e.g. Gym Routine, Marketing Tasks"
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{
                ...inputStyle,
                borderColor: nameError ? '#ef4444' : 'var(--glass-border)',
              }}
              disabled={isSubmitting}
            />
            {nameError && (
              <p className="text-red-400 text-[11px] mt-1 font-medium">{nameError}</p>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className="block mb-2" style={labelStyle}>Theme Color</label>
            <div className="flex items-center gap-2.5">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorHex(c)}
                  className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-200 ${
                    colorHex === c ? 'scale-125' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: c,
                    boxShadow: colorHex === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* List Type */}
          <div>
            <label className="block mb-2" style={labelStyle}>List Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 0, label: '📋 Standard Tasks', desc: 'To-do & Kanban boards' },
                { value: 1, label: '🏋️ Workout Tracker', desc: 'Sets, reps & volume' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setListType(opt.value)}
                  className="px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200"
                  style={
                    listType === opt.value
                      ? {
                          background: 'rgba(59,130,246,0.15)',
                          border: '1px solid rgba(59,130,246,0.4)',
                          color: 'var(--text-primary)',
                        }
                      : {
                          background: 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-secondary)',
                        }
                  }
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Dropdown (Workout type only) */}
          {listType === 1 && (
            <div>
              <label className="block mb-1.5" style={labelStyle}>Workout Template</label>
              {templatesLoading ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading templates...</span>
                </div>
              ) : (
                <select
                  value={workoutTemplateId}
                  onChange={(e) => setWorkoutTemplateId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none cursor-pointer"
                  style={inputStyle}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                      {t.name} — {t.description}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Collaboration */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer select-none"
            style={{ background: 'var(--hover-bg)', border: '1px solid var(--glass-border)' }}
            onClick={() => setIsCollaborative((v) => !v)}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors"
              style={{
                background: isCollaborative ? '#3b82f6' : 'transparent',
                border: isCollaborative ? '1px solid #3b82f6' : '1px solid var(--glass-border)',
              }}
            >
              {isCollaborative && <span className="text-white text-[10px] font-black">✓</span>}
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Enable Team Collaboration</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Real-time sync via SignalR</div>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-3 pt-3 mt-1"
            style={{ borderTop: '1px solid var(--glass-border)' }}
          >
            <button
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (listType === 1 && templatesLoading)}
              className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewListModal;
