'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*----------------------------------------------------------------------------*/
// Copyright (c) 2009 pidder <www.pidder.com>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*----------------------------------------------------------------------------*/
/*
*  AES CBC (Cipher Block Chaining) Mode for use in pidCrypt Library
*  The pidCrypt AES CBC mode is compatible with openssl aes-xxx-cbc mode
*  using the same algorithms for key and iv creation and padding as openssl.
*
*  Depends on pidCrypt (pidcrypt.js, pidcrypt_util.js), AES (aes_core.js)
*  and MD5 (md5.js)
*
/*----------------------------------------------------------------------------*/

var pidCrypt = require('./pidcrypt.js');
var pidCryptUtil = require('./pidcrypt_util.js');

require('./md5.js');
require('./aes_core.js');

