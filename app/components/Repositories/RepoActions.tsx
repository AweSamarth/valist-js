import { ProjectType } from '@valist/sdk/dist/types';
import React, { useEffect, useState, useRef } from 'react';
import { projectTypes, GetActions } from '../../utils/Actions';
import copyToCB from '../../utils/clipboard';

interface RepoActionsProps {
  orgName: string,
  repoName: string,
  projectType: ProjectType,
  showAll: boolean,
}

const RepoActions = (props: RepoActionsProps) => {
  const [actions, setActions] = useState({} as Record<string, any>);
  const installRef = useRef(null);

  const {
    orgName, repoName, projectType, showAll,
  } = props;

  let actionView = 'default';
  if (showAll) {
    actionView = 'actions';
  }

  const loadAction = () => {
    try {
      return projectTypes[projectType][actionView];
    } catch (err) {
      return undefined;
    }
  };

  useEffect(() => {
    let { origin } = window.location;
    if (origin === 'http://localhost:3000') {
      origin = 'http://localhost:9000';
    }
    setActions(GetActions(origin, orgName, repoName));
  }, []);

  return (
    <div>
      {(loadAction() && Object.keys(actions).length
        && projectTypes[projectType][actionView].map((action: string) => (
          <div key={action} className="pb-4">
            <h1 className="text-xl text-gray-900 mb-2">
              {actions[action].description}
            </h1>
            <div ref={installRef} className="col-span-12 flex bg-indigo-50 rounded-lg justify-between">
              <pre style={{ overflow: 'scroll' }} className="p-2 hide-scroll">
                <code>
                  {actions[action].command}
                </code>
              </pre>
              <div className="m-2" style={{ minHeight: '25px', minWidth: '25px' }}>
                <svg onClick={() => copyToCB(installRef)}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 float-right cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2
                          2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>)))}
    </div>
  );
};

export default RepoActions;
