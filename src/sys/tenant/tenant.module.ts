import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { PackageModule } from '../package/package.module'

@Module({
  imports: [PackageModule],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
