import { ApiProperty } from '@nestjs/swagger';

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
    type: Array,
    description: 'Branches not forked',
  })
  branches: Branch[];
}

export class Branch {
  @ApiProperty({
    type: String,
    description: 'Branches name',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Last commit SHA ID',
  })
  lastCommitSHA: string;
}
