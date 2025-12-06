import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, FastForward, Terminal, Lock, Unlock, Gamepad2, BookOpen, Info, CheckCircle2 } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import MazeRenderer from './components/MazeRenderer';
import { LEVELS } from './constants';
import { executeCode } from './services/interpreter';
import { RobotState, Direction, Point, CellType } from './types';

function App() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  // Level progression state - default to 1 (index 0 is unlocked)
  const [maxUnlockedLevelIdx, setMaxUnlockedLevelIdx] = useState(0);
  
  const [activeTab, setActiveTab] = useState<'game' | 'howto' | 'about'>('game');
  
  const activeLevel = LEVELS[currentLevelIdx];
  
  const [code, setCode] = useState('// Level 1: First Steps\nforward;\nforward;\n');
  const [frames, setFrames] = useState<RobotState[]>([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(300);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize robot state
  const getInitialState = (): RobotState => {
    let start: Point = {x:0, y:0};
    const grid = activeLevel.grid;
    for(let y=0; y<grid.length; y++) {
      for(let x=0; x<grid[y].length; x++) {
        if(grid[y][x] === CellType.Start) start = {x, y};
      }
    }
    return {
      position: start,
      direction: Direction.East,
      crashed: false,
      finished: false,
      logs: []
    };
  };

  const currentState = frames.length > 0 ? frames[currentFrameIdx] : getInitialState();

  // Handle Level Completion
  useEffect(() => {
    if (currentState.finished) {
      if (currentLevelIdx === maxUnlockedLevelIdx && maxUnlockedLevelIdx < LEVELS.length - 1) {
        setMaxUnlockedLevelIdx(prev => prev + 1);
      }
    }
  }, [currentState.finished, currentLevelIdx, maxUnlockedLevelIdx]);

  const handleRun = () => {
    setError(null);
    const result = executeCode(code, activeLevel.grid);
    if (!result.success) {
      setError(result.error || "Unknown error");
      setLogs(prev => [...prev, `Error: ${result.error}`]);
      return;
    }
    
    setFrames(result.frames || []);
    setCurrentFrameIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFrames([]);
    setCurrentFrameIdx(0);
    setLogs([]);
    setError(null);
  };

  const changeLevel = (idx: number) => {
    if (idx > maxUnlockedLevelIdx) return;
    setCurrentLevelIdx(idx);
    handleReset();
    setCode(`// ${LEVELS[idx].name}\n\n`);
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      changeLevel(currentLevelIdx + 1);
    }
  };

  // Animation Loop
  useEffect(() => {
    let interval: number;
    if (isPlaying && frames.length > 0) {
      interval = window.setInterval(() => {
        setCurrentFrameIdx(prev => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, frames, playbackSpeed]);

  // Update logs based on frame
  useEffect(() => {
    if(frames.length > 0 && currentFrameIdx < frames.length) {
       setLogs(frames[currentFrameIdx].logs);
    }
  }, [currentFrameIdx, frames]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Left Panel: Code & Controls */}
      <div className="w-full md:w-1/2 flex flex-col h-screen border-r border-slate-800">
        <header className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Robot Runner
            </h1>
          </div>
        </header>

        <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
           {/* Error Alert */}
           {error && (
            <div className="bg-red-900/30 border border-red-700/50 p-3 rounded-lg text-sm text-red-200 font-mono animate-pulse">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="flex-1 relative shadow-lg">
             <CodeEditor code={code} onChange={setCode} disabled={isPlaying} />
          </div>

          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 h-32 overflow-y-auto font-mono text-xs shadow-inner">
            <div className="text-slate-500 mb-1 border-b border-slate-800 pb-1 flex justify-between">
                <span>CONSOLE</span>
                {currentState.finished && <span className="text-emerald-400">COMPLETE</span>}
            </div>
            {logs.length === 0 && <span className="text-slate-600 italic">Ready for execution...</span>}
            {logs.map((log, i) => (
              <div key={i} className="mb-0.5">
                <span className="text-slate-500 mr-2">[{i + 1}]</span>
                <span className={log.includes('Crash') ? 'text-red-400' : log.includes('Goal') ? 'text-emerald-400' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
             <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={isPlaying}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
                    isPlaying 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/20 active:scale-95'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Run
                </button>
                
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
             </div>

             <div className="flex items-center gap-3">
               <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Speed</span>
               <input 
                 type="range" 
                 min="50" 
                 max="1000" 
                 step="50"
                 value={1050 - playbackSpeed} // Invert so right is faster
                 onChange={(e) => setPlaybackSpeed(1050 - parseInt(e.target.value))}
                 className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <FastForward className="w-4 h-4 text-slate-500" />
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Tabs & Game */}
      <div className="w-full md:w-1/2 bg-slate-950 flex flex-col h-screen">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
            <button 
                onClick={() => setActiveTab('game')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${activeTab === 'game' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
            >
                <Gamepad2 className="w-4 h-4" /> Game
            </button>
            <button 
                onClick={() => setActiveTab('howto')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${activeTab === 'howto' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
            >
                <BookOpen className="w-4 h-4" /> How to Play
            </button>
            <button 
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${activeTab === 'about' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
            >
                <Info className="w-4 h-4" /> About
            </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8 relative">
            
            {activeTab === 'game' && (
                <div className="flex flex-col h-full items-center">
                    {/* Level Selector */}
                    <div className="w-full max-w-lg mb-8">
                        <div className="flex justify-between items-center relative">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
                            
                            {LEVELS.map((level, idx) => {
                                const isUnlocked = idx <= maxUnlockedLevelIdx;
                                const isCompleted = idx < maxUnlockedLevelIdx;
                                const isActive = idx === currentLevelIdx;
                                
                                return (
                                    <button
                                        key={level.id}
                                        onClick={() => changeLevel(idx)}
                                        disabled={!isUnlocked}
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                                            ${isActive ? 'scale-125 ring-4 ring-indigo-500/20' : ''}
                                            ${isActive 
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                                                : isUnlocked 
                                                    ? 'bg-slate-800 border-indigo-500/50 text-indigo-200 hover:bg-slate-700' 
                                                    : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {isCompleted && !isActive ? <CheckCircle2 className="w-5 h-5" /> : 
                                         !isUnlocked ? <Lock className="w-4 h-4" /> : 
                                         <span className="font-bold">{idx + 1}</span>}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="text-center mt-4">
                            <h2 className="text-xl font-bold text-white mb-1">{activeLevel.name}</h2>
                            <p className="text-slate-400 text-sm">{activeLevel.description}</p>
                        </div>
                    </div>

                    {/* Maze Visualization */}
                    <div className="flex-1 flex items-center justify-center w-full min-h-[300px]">
                        <div className="transform scale-100 md:scale-110 transition-transform">
                             <MazeRenderer grid={activeLevel.grid} robotState={currentState} />
                        </div>
                    </div>

                    {/* Completion Status */}
                    <div className="h-20 w-full flex items-center justify-center">
                        {currentState.finished && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center gap-3">
                                <span className="inline-block px-5 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-full font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-bounce">
                                    Level Complete! 🎉
                                </span>
                                {currentLevelIdx < LEVELS.length - 1 && (
                                    <button 
                                        onClick={nextLevel}
                                        className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                    >
                                        Next Level <Unlock className="w-3 h-3" />
                                    </button>
                                )}
                                {currentLevelIdx === LEVELS.length - 1 && (
                                    <span className="text-slate-400 text-sm">You are a coding master!</span>
                                )}
                            </div>
                        )}

                        {currentState.crashed && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <span className="inline-block px-5 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-full font-bold">
                                    Crashed! 💥
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'howto' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-400 mb-4">How to Play</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Welcome to Robot Runner! Your goal is to guide the robot from the <span className="text-blue-400 font-bold">Start</span> to the <span className="text-emerald-400 font-bold">Goal</span> by writing code.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-indigo-500" /> Basic Commands
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-300 font-mono">
                            <li className="flex items-center gap-3">
                                <code className="bg-slate-800 px-2 py-1 rounded text-emerald-300">forward;</code>
                                <span>Move one step forward in current direction.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300">left;</code>
                                <span>Turn 90 degrees to the left.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300">right;</code>
                                <span>Turn 90 degrees to the right.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FastForward className="w-5 h-5 text-indigo-500" /> Sensors & Logic
                        </h3>
                        <div className="space-y-4 text-sm text-slate-300">
                            <div>
                                <p className="mb-2">The robot has sensors to detect walls. Use them in loops and conditions:</p>
                                <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2 font-mono text-xs">
                                    <li>wall_ahead</li>
                                    <li>path_ahead</li>
                                    <li>is_goal</li>
                                </ul>
                            </div>
                            
                            <div className="border-t border-slate-800 pt-4">
                                <p className="mb-2 font-semibold text-white">Examples:</p>
                                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs overflow-x-auto">
{`// Keep moving until a wall
while (path_ahead) {
  forward;
}

// Turn if blocked
if (wall_ahead) {
  left;
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'about' && (
                <div className="max-w-xl mx-auto text-center space-y-6 animate-in fade-in duration-300 mt-10">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-900/50">
                        <Terminal className="w-10 h-10 text-white" />
                    </div>
                    
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Robot Runner</h2>
                        <p className="text-indigo-400 font-medium">Educational Coding Puzzle</p>
                    </div>

                    <p className="text-slate-400 leading-relaxed">
                        Designed to teach the fundamentals of algorithmic thinking, control flow, and debugging.
                        Master 5 increasingly difficult levels to prove your programming prowess.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <h4 className="font-bold text-white mb-1">Levels</h4>
                            <p className="text-2xl text-indigo-400 font-mono">5</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <h4 className="font-bold text-white mb-1">Difficulty</h4>
                            <p className="text-sm text-slate-400 mt-1">Adaptive</p>
                        </div>
                    </div>
                    
                    <div className="pt-8 text-xs text-slate-600">
                        Built with React, Tailwind & Love.
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}

export default App;
