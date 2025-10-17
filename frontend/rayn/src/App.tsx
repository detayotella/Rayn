import React from 'react';
import { AppRouter } from './router';

const App: React.FC = () => {
  return (
    <div className=" mx-auto font-dmsans text-[16px] text-dark w-[100%]">
      <AppRouter />
    </div>
  )
}

export default App;
