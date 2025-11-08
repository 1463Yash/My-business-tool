 import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import Authform from './Authforms/Authfrom';

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

      {visible && <Authform onClose={handleSigninClose} />}

    </div>
  );
}
