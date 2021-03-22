import {
  HttpService,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GithubRepositoryResponse } from '../interfaces/github-repository-response.interface';

@Injectable()
export class GithubRepositoryService {
  constructor(private httpService: HttpService) {}

  public async findNotForkedByUserName(
    userName: string,
    perPage: number,
  ): Promise<GithubRepositoryResponse[]> {
    try {
      const gitHubRepositories = await this.httpService
        .get<GithubRepositoryResponse[]>(
          `https://api.github.com/users/${userName}/repos`,
          {
            params: {
              per_page: perPage,
            },
            headers: {
              accept: 'application/vnd.github.v3+json',
            },
          },
        )
        .toPromise();
      const response: GithubRepositoryResponse[] = [];
      for (const repository of gitHubRepositories.data) {
        if (!repository.fork) {
          response.push(repository);
        }
      }
      return response;
    } catch (error) {
      if (error.response?.status == 404) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: 'User Not Found',
        });
      }
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
