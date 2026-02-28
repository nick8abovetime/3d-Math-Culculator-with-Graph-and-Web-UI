import './Header.css';

interface HeaderProps {
  mode: '2d' | '3d';
  onModeChange: (mode: '2d' | '3d') => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">3D Math Calculator</h1>
      <div className="header-controls">
        <button
          className={`mode-btn ${mode === '2d' ? 'active' : ''}`}
          onClick={() => onModeChange('2d')}
        >
          2D
        </button>
        <button
          className={`mode-btn ${mode === '3d' ? 'active' : ''}`}
          onClick={() => onModeChange('3d')}
        >
          3D
        </button>
      </div>
    </header>
  );
}