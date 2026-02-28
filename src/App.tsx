import { useState } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { Viewport2D } from './components/Viewport2D/Viewport2D';
import { Viewport3D } from './components/Viewport3D/Viewport3D';
import { useMath } from './hooks/useMath';
import './App.css';

function App() {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const [currentExpression, setCurrentExpression] = useState<string | undefined>();
  const { history, currentResult, error, evaluate } = useMath();

  const handleCalculate = (expression: string) => {
    setCurrentExpression(expression);
    evaluate(expression);
  };

  return (
    <div className="app">
      <Header mode={mode} onModeChange={setMode} />
      <div className="main-content">
        <InputPanel
          onCalculate={handleCalculate}
          history={history}
          error={error}
          result={currentResult}
        />
        <div className="viewport-container">
          {mode === '2d' ? (
            <Viewport2D expression={currentExpression} />
          ) : (
            <Viewport3D expression={currentExpression} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;