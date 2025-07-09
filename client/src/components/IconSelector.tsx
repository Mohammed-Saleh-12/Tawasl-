import React from 'react';

const communicationIcons = [
  { value: 'fas fa-comments', label: 'Comments' },
  { value: 'fas fa-comment-dots', label: 'Comment Dots' },
  { value: 'fas fa-phone', label: 'Phone' },
  { value: 'fas fa-video', label: 'Video' },
  { value: 'fas fa-microphone', label: 'Microphone' },
  { value: 'fas fa-headset', label: 'Headset' },
  { value: 'fas fa-bullhorn', label: 'Bullhorn' },
  { value: 'fas fa-envelope', label: 'Envelope' },
  { value: 'fas fa-user-friends', label: 'User Friends' },
  { value: 'fas fa-chalkboard-teacher', label: 'Teacher' },
  { value: 'fas fa-user', label: 'User' },
  { value: 'fas fa-user-tie', label: 'User Tie' },
  { value: 'fas fa-users', label: 'Users' },
  { value: 'fas fa-question-circle', label: 'Question Circle' },
];

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {communicationIcons.map((icon) => (
        <button
          type="button"
          key={icon.value}
          onClick={() => onChange(icon.value)}
          style={{
            border: value === icon.value ? '2px solid #3B82F6' : '1px solid #ddd',
            borderRadius: 6,
            padding: 10,
            background: value === icon.value ? '#EFF6FF' : '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 60,
          }}
        >
          <i className={icon.value} style={{ fontSize: 24, marginBottom: 4, color: value === icon.value ? '#2563EB' : '#555' }}></i>
          <span style={{ fontSize: 12 }}>{icon.label}</span>
        </button>
      ))}
    </div>
  );
};

export default IconSelector; 