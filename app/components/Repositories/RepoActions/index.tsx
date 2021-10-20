import { ProjectType, RepoMeta } from '@valist/sdk/dist/types';
import BinaryMeta from './BinaryMeta';
import NpmMeta from './NpmMeta';
import PipMeta from './PipMeta';
import DockerMeta from './DockerMeta';

interface RepoActionsProps {
  orgName: string,
  repoName: string,
  repoMeta: RepoMeta
}

export default function RepoActions(props: RepoActionsProps): JSX.Element {
  const getProjectType = (projectType: ProjectType) => {
    switch (projectType) {
      case 'node':
        return NpmMeta(props.orgName, props.repoName);
      case 'npm':
        return NpmMeta(props.orgName, props.repoName);
      case 'python':
        return PipMeta(props.orgName, props.repoName);
      case 'docker':
        return DockerMeta(props.orgName, props.repoName, props.repoMeta);
      default:
        return BinaryMeta(props.orgName, props.repoName);
    }
  };

  return (
      <div className="p-8">
        { getProjectType(props.repoMeta.projectType) }
      </div>
  );
}
