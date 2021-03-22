import { Injectable } from '@nestjs/common';
import {
  UserRepositoriesResponseDTO,
  Branch,
} from '../../api/dto/userRepositories-response-dto';
import { GithubBranchResponse } from '../interfaces/github-branch-response.interface';
import { GithubRepositoryResponse } from '../interfaces/github-repository-response.interface';
import { GithubBranchService } from './github-branch.service';
import { GithubCommitService } from './github-commit.service';
import { GithubRepositoryService } from './github-repository.service';

@Injectable()
export class GithubIntegrationService {
  constructor(
    private githubRepository: GithubRepositoryService,
    private githubBranch: GithubBranchService,
    private githubCommit: GithubCommitService,
  ) {}

  async getUserRepositoriesNotForked(
    userName: string,
    perPage?: number,
  ): Promise<UserRepositoriesResponseDTO[]> {
    const userRepositories = await this.githubRepository.findNotForkedByUserName(
      userName,
      perPage,
    );
    const result = await this.getBranches(userRepositories, userName);

    return result;
  }

  private async getBranches(
    userRepositories: GithubRepositoryResponse[],
    userName: string,
  ): Promise<UserRepositoriesResponseDTO[]> {
    const userResponseDto: UserRepositoriesResponseDTO[] = [];

    for (const repository of userRepositories) {
      const branches = await this.githubBranch.getBranches(
        userName,
        repository.name,
      );

      const branchResult = await this.getCommits(branches);

      const item = new UserRepositoriesResponseDTO();
      item.branches = branchResult;
      item.ownerUserName = repository.owner.login;
      item.repositoryName = repository.name;

      userResponseDto.push(item);
    }

    return userResponseDto;
  }

  private async getCommits(
    branches: GithubBranchResponse[],
  ): Promise<Branch[]> {
    const branchesResponse: Branch[] = [];

    for (const branch of branches) {
      const branchItem = new Branch();
      branchItem.name = branch.name;
      branchItem.lastCommitSHA = branch.commit.sha;

      branchesResponse.push(branchItem);
    }

    return branchesResponse;
  }
}
