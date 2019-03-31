'use strict';

/*!Copyright (c) 2009 pidder <www.pidder.com>*/
/*----------------------------------------------------------------------------*/
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License as
// published by the Free Software Foundation; either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
// 02111-1307 USA or check at http://www.gnu.org/licenses/gpl.html

/*----------------------------------------------------------------------------*/
/*
*  pidCrypt AES core implementation for block en-/decryption for use in pidCrypt
*  Library.
*  Derived from jsaes version 0.1 (See original license below)
*  Only minor Changes (e.g. using a precompiled this.SBoxInv) and port to an
*  AES Core Class for use with different AES modes.
*
*  Depends on pidCrypt (pidcrypt.js, pidcrypt_util.js)
/*----------------------------------------------------------------------------*/
/*    jsaes version 0.1  -  Copyright 2006 B. Poettering
 *    http://point-at-infinity.org/jsaes/
 *    Report bugs to: jsaes AT point-at-infinity.org
 *
 *
 * This is a javascript implementation of the AES block cipher. Key lengths
 * of 128, 192 and 256 bits are supported.
 * The well-functioning of the encryption/decryption routines has been
 * verified for different key lengths with the test vectors given in
 * FIPS-197, Appendix C.
 * The following code example enciphers the plaintext block '00 11 22 .. EE FF'
 * with the 256 bit key '00 01 02 .. 1E 1F'.
 *    AES_Init();
 *    var block = new Array(16);
 *    for(var i = 0; i < 16; i++)
 *        block[i] = 0x11 * i;
 *    var key = new Array(32);
 *    for(var i = 0; i < 32; i++)
 *        key[i] = i;
 *    AES_ExpandKey(key);
 *    AES_Encrypt(block, key);
 *    AES_Done();
/*----------------------------------------------------------------------------*/
var pidCrypt = require('./pidcrypt.js');

