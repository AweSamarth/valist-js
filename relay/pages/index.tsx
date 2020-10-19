import React from 'react';
import IndexLayout from '../components/Layout/IndexLayout'
import ProjectList from '../components/ProjectsList/ProjectsList'
import ActivityFeed from '../components/ActivityFeed/ActivityFeed';
import ProfileSidebar from '../components/ProfileSidebar/ProfileSidebar';

export const IndexPage = ({valist}: {valist: any}) => {
  return (
    <IndexLayout title="valist.io">
      <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
        <div className="flex-1 min-w-0 bg-white xl:flex">
          <ProfileSidebar valist={valist} />
          <ProjectList valist={valist} />
          <ActivityFeed valist={valist} />
        </div>
      </div>
    </IndexLayout>
  );
}

export default IndexPage
