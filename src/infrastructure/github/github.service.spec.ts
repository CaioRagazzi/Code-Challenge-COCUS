import { HttpModule, HttpService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { GithubBranchResponse } from '../interfaces/github-branch-response.interface';
import { GithubRepositoryResponse } from '../interfaces/github-repository-response.interface';
import { GithubBranchService } from './github-branch.service';
import { GithubCommitService } from './github-commit.service';
import { GithubRepositoryService } from './github-repository.service';
import { GithubIntegrationService } from './githubIntegration.service';
import { resultGithubRepositoryResponse } from '../../../test/githubRepositoryResult';
import { GithubCommitResponse } from '../interfaces/github-commit-response.interface';
import { resultGithubCommitResponse } from '../../../test/githubCommitResult';
import { UserRepositoriesResponseDTO } from '../../api/dto/userRepositories-response-dto';

describe('GitHubService', () => {
  let githubIntegrationService: GithubIntegrationService;
  let githubRepository: GithubRepositoryService;
  let githubBranch: GithubBranchService;
  let githubCommit: GithubCommitService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        GithubBranchService,
        GithubRepositoryService,
        GithubCommitService,
        GithubIntegrationService,
      ],
    }).compile();
    githubRepository = module.get<GithubRepositoryService>(
      GithubRepositoryService,
    );
    githubBranch = module.get<GithubBranchService>(GithubBranchService);
    githubCommit = module.get<GithubCommitService>(GithubCommitService);

    githubIntegrationService = new GithubIntegrationService(
      githubRepository,
      githubBranch,
      githubCommit,
    );
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
  });

  describe('getcommit', () => {
    it('should return last commit by user name, repository and shaid', done => {
      const result: GithubCommitResponse = resultGithubCommitResponse;

      const response: AxiosResponse<GithubCommitResponse> = {
        data: result,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      githubCommit
        .getLastCommitByUserNameAndRepositoryNameAndShaId(
          'caioragazzi',
          'repositoryName',
          'SHA',
        )
        .then(res => {
          expect(res).toEqual(result);
          done();
        });
    });
  });

  describe('getcommit', () => {
    it('should return last commit by user name and repository', done => {
      const result: GithubCommitResponse = resultGithubCommitResponse;

      const response: AxiosResponse<GithubCommitResponse> = {
        data: result,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      githubCommit
        .getLastCommitByUserNameAndRepositoryName(
          'caioragazzi',
          'repositoryName',
        )
        .then(res => {
          expect(res).toEqual(result);
          done();
        });
    });
  });

  describe('getRepositoriesDTO', () => {
    it('should return an array user repositories dto', async () => {
      const resultRepo: GithubRepositoryResponse[] = resultGithubRepositoryResponse;
      const resultCommit: GithubCommitResponse = resultGithubCommitResponse;
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

      jest
        .spyOn(githubCommit, 'getLastCommitByUserNameAndRepositoryNameAndShaId')
        .mockImplementation(async () => resultCommit);

      expect(
        await githubIntegrationService.getUserRepositoriesNotForked(
          'caioragazzi',
          0,
        ),
      ).toEqual(result);
    });
  });
});
