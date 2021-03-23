import { Injectable } from '@nestjs/common';
import {
  UserRepositoriesResponseDTO,
  Branch,
} from '../../api/dto/userRepositories-response-dto';
import { GithubBranchResponse } from '../models/github-branch-response';
import { GithubRepositoryResponse } from '../models/github-repository-response';
import { GithubBranchService } from './github-branch.service';
import { GithubRepositoryService } from './github-repository.service';

@Injectable()
export class GithubIntegrationService {
  constructor(
    private githubRepository: GithubRepositoryService,
    private githubBranch: GithubBranchService,
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
