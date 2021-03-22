import { HttpModule } from '@nestjs/common';
import { GithubBranchService } from '../../infrastructure/github/github-branch.service';
import { GithubCommitService } from '../../infrastructure/github/github-commit.service';
import { GithubRepositoryService } from '../../infrastructure/github/github-repository.service';
import { GithubIntegrationService } from '../../infrastructure/github/githubIntegration.service';
import { UserRepositoriesResponseDTO } from '../dto/userRepositories-response-dto';
import { GithubController } from './github.controller';
import { Test } from '@nestjs/testing';

describe('GitHubController', () => {
  let githubController: GithubController;
  let githubIntegrationService: GithubIntegrationService;
  let githubRepository: GithubRepositoryService;
  let githubBranch: GithubBranchService;
  let githubCommit: GithubCommitService;

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
    githubController = new GithubController(githubIntegrationService);
  });

  describe('GetUserRepositoriesNotForked', () => {
    it('should return an array of user response', async () => {
      const result: UserRepositoriesResponseDTO[] = [
        {
          branches: [
            {
              name: 'dependabot/npm_and_yarn/axios-0.21.1',
              lastCommitSHA: '9d94c121d9dee48c8b813cdbd469b83c0ee0aba9',
            },
            {
              name: 'dependabot/npm_and_yarn/lodash-4.17.19',
              lastCommitSHA: 'd3ea7c641b1e0c523864308cfefc500ff96b5730',
            },
            {
              name: 'master',
              lastCommitSHA: '4dccc1240bb026d236652f3ce7172c5f72c03547',
            },
          ],
          ownerUserName: 'CaioRagazzi',
          repositoryName: 'AGEMMobile',
        },
      ];

      jest
        .spyOn(githubIntegrationService, 'getUserRepositoriesNotForked')
        .mockImplementation(async () => result);

      expect(
        await githubController.GetUserRepositoriesNotForked('caio', ''),
      ).toBe(result);
    });
  });
});
