import React, { useEffect, useState, useRef } from 'react';

import copyToCB from '../../../utils/clipboard';

const BinaryMeta = (orgName = 'organization', repoName = 'repo') => {
  const curlRef = useRef(null);

  const [origin, setOrigin] = useState('https://app.valist.io');
  useEffect(() => {
    setOrigin(window.location.origin);
  });

  return (
        <div>
                <div className="pb-2 mb-2">
                    <h2 className="flex-1 text-xl">Download (GET) from Url</h2>
                </div>
                <div ref={curlRef} onClick={() => copyToCB(curlRef)}
                    className="border-2 border-solid border-indigo-50 rounded-lg
                    p-2 bg-indigo-50 cursor-pointer break-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2
                        2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>curl -L -o {repoName} {origin}/api/{orgName}/{repoName}/latest</p>
                    <p>chmod +x {repoName}</p>
                </div>
        </div>
  );
};

export default BinaryMeta;
