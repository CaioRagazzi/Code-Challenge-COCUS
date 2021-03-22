import { HttpService, Injectable, Scope } from '@nestjs/common';
import { GithubCommitResponse } from '../interfaces/github-commit-response.interface';

@Injectable()
export class GithubCommitService {
  constructor(private httpService: HttpService) {}
  async getLastCommitByUserNameAndRepositoryName(
    userName: string,
    repositoryName: string,
  ): Promise<GithubCommitResponse[]> {
    const gitHubCommitResponse = await this.httpService
      .get<GithubCommitResponse[]>(
        `https://api.github.com/repos/${userName}/${repositoryName}/commits`,
        {
          params: {
            per_page: 1,
          },
        },
      )
      .toPromise();

    return gitHubCommitResponse.data;
  }

  async getLastCommitByUserNameAndRepositoryNameAndShaId(
    userName: string,
    repositoryName: string,
    shaId: string,
  ): Promise<GithubCommitResponse> {
    const gitHubCommitResponse = await this.httpService
      .get<GithubCommitResponse>(
        `https://api.github.com/repos/${userName}/${repositoryName}/commits/${shaId}`,
        {
          params: {
            per_page: 1,
          },
          headers: {
            accept: 'application/vnd.github.v3+json',
          },
        },
      )
      .toPromise();

    return gitHubCommitResponse.data;
  }

  async getLastCommitByShaIdList(
    shaIdList: string[],
  ): Promise<GithubCommitResponse> {
    const shaJoined = shaIdList.join('+');
    const gitHubCommitResponse = await this.httpService
      .get<GithubCommitResponse>(`https://api.github.com/search/commits`, {
        params: {
          q: shaJoined,
        },
        headers: {
          accept: 'application/vnd.github.cloak-preview+json',
        },
      })
      .toPromise();

    return gitHubCommitResponse.data;
  }
}
