import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Repository, Release } from '@valist/sdk/dist/types';
import Layout from '../../../components/Layouts/DashboardLayout';
import RepoContent from '../../../components/Repositories/RepoContent';
import ProjectProfileCard from '../../../components/Repositories/ProjectProfileCard';
import RepoMetaCard from '../../../components/Repositories/RepoMeta';
import ValistContext from '../../../components/Valist/ValistContext';
import ErrorDialog from '../../../components/Dialog/ErrorDialog';

export default function Dashboard() {
  const valist = useContext(ValistContext);
  const router = useRouter();
  const orgName = `${router.query.orgName}`;
  const repoName = `${router.query.repoName}`;

  const [error, setError] = useState<Error>();
  const [repo, setRepo] = useState<Repository>({
    orgID: 'Loading',
    threshold: 0,
    thresholdDate: 0,
    meta: {
      projectType: 'binary',
      description: 'Loading',
      name: 'Loading',
    },
    metaCID: 'Loading',
    tags: [],
  });
  const [repoDevs, setRepoDevs] = useState<string[]>([]);
  const [orgAdmins, setOrgAdmins] = useState<string[]>([]);
  const [repoReleases, setRepoReleases] = useState<Release[]>([]);
  const [repoView, setRepoView] = useState<string>('meta');
  const [repoReadme, setRepoReadme] = useState<string>('');
  const [releaseMeta, setReleaseMeta] = useState<any>({});

  const fetchReadme = async () => {
    const release = repoReleases[0];
    let metaJson;
    if (release && release.releaseCID !== '') {
      let requestURL = `https://gateway.valist.io/ipfs/${release.releaseCID.replace('/ipfs/', '')}`;
      if (repo.meta.projectType === 'npm') {
        requestURL = `https://gateway.valist.io/ipfs/${release.metaCID.replace('/ipfs/', '')}`;
      }
      try {
        const req = await fetch(requestURL);
        metaJson = await req.json();
        setRepoReadme(metaJson.readme);
      } catch (e) {
        // noop
      }
    }
  };

  const parseReadmeFromPackageJSON = () => {
    try {
      const packageJSON = JSON.parse(repoReadme);
      setRepoReadme(packageJSON.readme);
      setReleaseMeta(packageJSON);
    } catch (e) {
      // noop
    }
  };

  const fetchAll = () => Promise.all([
    valist.getRepository(orgName, repoName).then(setRepo),
    valist.getReleases(orgName, repoName, 1, 10).then((releases) => setRepoReleases(releases.reverse())),
    valist.getRepoDevs(orgName, repoName).then(setRepoDevs),
    valist.getOrgAdmins(orgName).then(setOrgAdmins),
  ]);

  const getData = async () => {
    try {
      if (orgName && repoName) {
        await fetchAll();
      }
    } catch (e) {
      setError(e as any);
    }
  };

  useEffect(() => {
    getData();
  }, [valist, orgName, repoName]);

  useEffect(() => {
    fetchReadme();
  }, [repo, repoReleases]);

  useEffect(() => {
    parseReadmeFromPackageJSON();
  }, [repoReadme]);

  return (
    <Layout>
        <Head>
          <meta name="go-import" content={
            `app.valist.io/${orgName}/${repoName} git https://app.valist.io/api/git/${orgName}/${repoName}`
          } />
        </Head>
        <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
          <div className="grid grid-cols-1 gap-4 lg:col-span-4">
            <ProjectProfileCard
              setRepoView={setRepoView}
              orgName={orgName}
              repoName={repoName}
              repoMeta={repo.meta} />
            <section className="rounded-lg bg-white overflow-hidden shadow">
              {repo && <RepoContent
                repoReleases={repoReleases}
                releaseMeta={releaseMeta}
                repoReadme={repoReadme}
                view={repoView}
                orgName={orgName}
                repoName={repoName}
                repoMeta={repo.meta}
                repoDevs={repoDevs}
                orgAdmins={orgAdmins}/>}
            </section>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <RepoMetaCard
            releaseMeta={releaseMeta}
            repoMeta={repo.meta}
            orgName={orgName}
            repoName={repoName} />
          </div>
      </div>
      {error && <ErrorDialog error={error} close={() => setError(undefined)} />}
    </Layout>
  );
}
