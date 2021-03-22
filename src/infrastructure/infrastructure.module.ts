import { HttpModule, Module } from '@nestjs/common';
import { GithubBranchService } from './github/github-branch.service';
import { GithubCommitService } from './github/github-commit.service';
import { GithubRepositoryService } from './github/github-repository.service';
import { GithubIntegrationService } from './github/githubIntegration.service';

@Module({
  imports: [
    HttpModule.register({
      auth: {
        username: 'unkonw',
        password: 'unkonw',
      },
    }),
  ],
  providers: [
    GithubIntegrationService,
    GithubRepositoryService,
    GithubBranchService,
    GithubCommitService,
  ],
  exports: [
    GithubIntegrationService,
    GithubRepositoryService,
    GithubBranchService,
    GithubCommitService,
  ],
})
export class InfrastructureModule {}
