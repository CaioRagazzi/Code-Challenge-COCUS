export interface GithubBranchResponse {
  name: string;
  commit: Commit;
  protected: boolean;
}

interface Commit {
  sha: string;
  url: string;
}
