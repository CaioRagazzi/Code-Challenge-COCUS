import { GithubUser } from './github-user.interface';

export interface GithubCommitResponse {
  sha: string;
  node_id: string;
  commit: Commit;
  url: string;
  html_url: string;
  comments_url: string;
  author: GithubUser;
  committer: GithubUser;
  parents: Parent[];
}

interface Commit {
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  message: string;
  tree: {
    sha: string;
    url: string;
  };
  url: string;
  comment_count: number;
  verification: {
    verified: false;
    reason: string;
    signature: string;
    payload: string;
  };
}

interface Parent {
  sha: string;
  url: string;
  html_url: string;
}
