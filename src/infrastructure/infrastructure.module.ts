import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { GithubBranchService } from './github/github-branch.service';
import { GithubRepositoryService } from './github/github-repository.service';
import { GithubIntegrationService } from './github/githubIntegration.service';

@Module({
  imports: [HttpModule],
  providers: [
    GithubIntegrationService,
    GithubRepositoryService,
    GithubBranchService,
    AuthService,
  ],
  exports: [
    GithubIntegrationService,
    GithubRepositoryService,
    GithubBranchService,
    AuthService,
  ],
})
export class InfrastructureModule {}
