import { ApiProperty } from '@nestjs/swagger';

export class Branch {
  @ApiProperty({
    type: String,
    description: 'Branche name',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Last commit SHA ID',
  })
  lastCommitSHA: string;
}

export class UserRepositoriesResponseDTO {
  @ApiProperty({
    type: String,
    description: 'Repository name',
  })
  repositoryName: string;
  @ApiProperty({
    type: String,
    description: 'Owner name',
  })
  ownerUserName: string;
  @ApiProperty({
    type: [Branch],
    description: 'Branches',
  })
  branches: Branch[];
}
