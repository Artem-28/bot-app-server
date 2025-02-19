import { Controller, Get } from '@nestjs/common';
import { ResourceService } from '@/modules/resource/resource.service';

@Controller('api/v1')
export class ResourceController {
  constructor(readonly resourceService: ResourceService) {}

  @Get('permissions')
  async permissions() {
    return await this.resourceService.permissions();
  }
}
