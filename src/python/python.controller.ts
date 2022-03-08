import { Controller, Get } from '@nestjs/common';
import { PythonService } from './python.service';

@Controller('python')
export class PythonController {
  constructor(private pythonService: PythonService) {}

  @Get('')
  getPythonScript(): Promise<object> {
    return this.pythonService.getPythonScript();
  }
}
