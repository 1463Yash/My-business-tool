 import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import Signin from './Authforms/Signin';

export default function Home() {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => setVisible(true);
  const handleSigninClose = () => setVisible(false);

  return (
    <div className="main-header">
      <h2>HOME</h2>
      <div onClick={handleOpen}>
        {!visible && <UserRound />}
      </div>

      {visible && <Signin onClose={handleSigninClose} />}

    </div>
  );
}
