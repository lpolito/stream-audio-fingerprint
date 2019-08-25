// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Copyright (c) 2018 Alexandre Storelli

import Codegen from './codegen_landmark';

const decoder = require('child_process').spawn('ffmpeg', [
  '-i', 'pipe:0',
  '-acodec', 'pcm_s16le',
  '-ar', 22050,
  '-ac', 1,
  '-f', 'wav',
  '-v', 'fatal',
  'pipe:1',
], {stdio: ['pipe', 'pipe', process.stderr]});

process.stdin.pipe(decoder.stdin); // .write(data);

const fingerprinter = new Codegen();
decoder.stdout.pipe(fingerprinter);

fingerprinter.on('data', (data) => {
  for (let i = 0; i < data.tcodes.length; i += 1) {
    console.log(`time=${data.tcodes[i]} fingerprint=${data.hcodes[i]}`);
  }
});

fingerprinter.on('end', () => {
  console.log('fingerprints stream ended');
});
