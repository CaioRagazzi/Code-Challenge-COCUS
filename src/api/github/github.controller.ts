import {
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GithubIntegrationService } from '../../infrastructure/github/githubIntegration.service';
import { UserRepositoriesResponseDTO } from '../dto/userRepositories-response-dto';
import { HeaderInterceptor } from '../interceptors/header.interceptor';

@Controller('github')
@ApiTags('GitHub')
@UseInterceptors(HeaderInterceptor)
@ApiBasicAuth()
export class GithubController {
  constructor(private githubIntegrationService: GithubIntegrationService) {}
  @Get(':userName')
  @ApiProduces('application/json', 'application/xml')
  @ApiCreatedResponse({
    type: UserRepositoriesResponseDTO,
  })
  @ApiQuery({
    name: 'totalRepositories',
    required: false,
    schema: { default: 10 },
  })
  public async GetUserRepositoriesNotForked(
    @Param('userName') userName: string,
    @Query('totalRepositories') totalRepositories = 5,
  ): Promise<UserRepositoriesResponseDTO[]> {
    try {
      const userRepositories = await this.githubIntegrationService.getUserRepositoriesNotForked(
        userName,
        totalRepositories,
      );
      return userRepositories;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: 'User Not Found',
        });
      }

      if (error.response?.status === 403 && error.response?.data?.message) {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          message:
            "GitHub's  API rate limit exceeded! Please use Basic Auth to sign in",
        });
      }

      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
