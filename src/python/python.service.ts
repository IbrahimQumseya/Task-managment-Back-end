import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { PythonShell } from 'python-shell';

@Injectable()
export class PythonService {
  async getPythonScript(): Promise<object> {
    const dataToSend = ['1', '2', '3'];
    const python = spawn('python', ['C:/Ibrahim/Vallerry/script.py']);
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend.push(data.toString());
      console.log('pushing');
      console.log(data.toString());

      return dataToSend;
    });

    python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      console.log(dataToSend.join(''));
      return dataToSend;
    });
    console.log(dataToSend);
    console.log(dataToSend);
    return dataToSend;
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
