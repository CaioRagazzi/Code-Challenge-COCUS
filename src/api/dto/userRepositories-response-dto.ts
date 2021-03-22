export class UserRepositoriesResponseDTO {
  repositoryName: string;
  ownerUserName: string;
  branches: Branch[];
}

export class Branch {
  name: string;
  lastCommitSHA: string;
}
