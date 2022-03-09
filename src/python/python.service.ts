import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { PythonShell } from 'python-shell';

@Injectable()
export class PythonService {
  async getPythonScript(): Promise<any> {
    const dataToSend = ['1', '2', '3'];

    const child = exec('python C:/Ibrahim/Vallerry/script.py');
    const result = await new Promise<any>((resolve) => {
      child.on('exit', (data) => {
        resolve(data);
      });
    });

    return result;
  }

  async getPythonScriptShell(): Promise<object> {
    let sendToData;
    PythonShell.run(
      'script.py',
      {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: 'C:/Ibrahim/Vallerry/',
      },
      function (err, result) {
        if (err) throw err;
        console.log('result:', result.toString());
        sendToData = result.toString();
      },
    );
    console.log(sendToData);

    return sendToData;
  }
}
