import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  NotAcceptableException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GithubIntegrationService } from '../../infrastructure/github/githubIntegration.service';
import { UserRepositoriesResponseDTO } from '../dto/userRepositories-response-dto';

@Controller('github')
@ApiTags('GitHub')
export class GithubController {
  constructor(private githubIntegrationService: GithubIntegrationService) {}
  @Get(':userName')
  @ApiQuery({
    name: 'totalRepositories',
    required: false,
    schema: { default: 5 },
  })
  @ApiResponse({
    status: 200,
    description: 'GitHub repositories list.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiResponse({
    status: 406,
    description: 'Header not accepted.',
  })
  public async GetUserRepositoriesNotForked(
    @Param('userName') userName: string,
    @Headers() header?: unknown,
    @Query('totalRepositories') totalRepositories = 5,
  ): Promise<UserRepositoriesResponseDTO[]> {
    if (header['accept'] === 'application/xml') {
      throw new NotAcceptableException({
        status: HttpStatus.NOT_ACCEPTABLE,
        message: 'Header not Acceptable',
      });
    }
    const userRepositories = await this.githubIntegrationService.getUserRepositoriesNotForked(
      userName,
      totalRepositories,
    );
    return userRepositories;
  }
}
