import { HttpModule, HttpService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { GithubBranchResponse } from '../models/github-branch-response';
import { GithubRepositoryResponse } from '../models/github-repository-response';
import { GithubBranchService } from './github-branch.service';
import { GithubRepositoryService } from './github-repository.service';
import { GithubIntegrationService } from './githubIntegration.service';
import {
  resultGithubRepositoryResponse,
  resultGithubRepositoryResponseForked,
} from '../../../test/githubRepositoryResult';
import { UserRepositoriesResponseDTO } from '../../api/dto/userRepositories-response-dto';
import { AuthService } from '../auth/auth.service';

describe('GitHubService', () => {
  let githubIntegrationService: GithubIntegrationService;
  let githubRepository: GithubRepositoryService;
  let githubBranch: GithubBranchService;
  let authService: AuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        GithubBranchService,
        GithubRepositoryService,
        GithubIntegrationService,
        AuthService,
      ],
    }).compile();
    githubRepository = module.get<GithubRepositoryService>(
      GithubRepositoryService,
    );
    githubBranch = module.get<GithubBranchService>(GithubBranchService);

    githubIntegrationService = new GithubIntegrationService(
      githubRepository,
      githubBranch,
    );

    authService = module.get<AuthService>(AuthService);

    httpService = module.get<HttpService>(HttpService);
  });

  describe('getBranches', () => {
    it('should return an array of repositories branches', done => {
      const result: GithubBranchResponse[] = [
        {
          name: 'caio',
          commit: {
            sha: 'Sha',
            url: 'URL',
          },
          protected: false,
        },
      ];

      const response: AxiosResponse<GithubBranchResponse[]> = {
        data: result,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      githubBranch.getBranches('caioragazzi', 'repositoryName').then(res => {
        expect(res).toEqual(result);
        done();
      });
    });
  });

  describe('getRepositories', () => {
    it('should return an array of repositories', done => {
      const result: GithubRepositoryResponse[] = resultGithubRepositoryResponse;

      const response: AxiosResponse<GithubRepositoryResponse[]> = {
        data: result,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      githubRepository.findNotForkedByUserName('caioragazzi', 10).then(res => {
        expect(res).toEqual(result);
        done();
      });
    });

    it('should return an array of repositories and exclude forks', done => {
      const resultForked: GithubRepositoryResponse[] = resultGithubRepositoryResponseForked;
      const result: GithubRepositoryResponse[] = resultGithubRepositoryResponse;

      const response: AxiosResponse<GithubRepositoryResponse[]> = {
        data: resultForked,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      githubRepository.findNotForkedByUserName('caioragazzi', 10).then(res => {
        expect(res).toHaveLength(1);
        expect(res).toEqual(result);
        done();
      });
    });
  });

  describe('getRepositoriesDTO', () => {
    it('should return an array user repositories dto', async () => {
      const resultRepo: GithubRepositoryResponse[] = resultGithubRepositoryResponse;
      const resultBranches: GithubBranchResponse[] = [
        {
          name: 'caio',
          commit: {
            sha: 'Sha',
            url: 'URL',
          },
          protected: false,
        },
      ];
      const result: UserRepositoriesResponseDTO[] = [
        {
          repositoryName: 'test',
          ownerUserName: 'test',
          branches: [
            {
              name: 'caio',
              lastCommitSHA: 'Sha',
            },
          ],
        },
      ];

      jest
        .spyOn(githubRepository, 'findNotForkedByUserName')
        .mockImplementation(async () => resultRepo);

      jest
        .spyOn(githubBranch, 'getBranches')
        .mockImplementation(async () => resultBranches);

      expect(
        await githubIntegrationService.getUserRepositoriesNotForked(
          'caioragazzi',
          0,
        ),
      ).toEqual(result);
    });
  });
});
