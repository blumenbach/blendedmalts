function utf8_decode(str_data) {

  var tmp_arr = [],
    i = 0,
    c1 = 0,
    seqlen = 0;

  str_data += '';

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i) & 0xFF;
    seqlen = 0;

    // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    if (c1 <= 0xBF) {
      c1 = (c1 & 0x7F);
      seqlen = 1;
    } else if (c1 <= 0xDF) {
      c1 = (c1 & 0x1F);
      seqlen = 2;
    } else if (c1 <= 0xEF) {
      c1 = (c1 & 0x0F);
      seqlen = 3;
    } else {
      c1 = (c1 & 0x07);
      seqlen = 4;
    }

    for (var ai = 1; ai < seqlen; ++ai) {
      c1 = ((c1 << 0x06) | (str_data.charCodeAt(ai + i) & 0x3F));
    }

    if (seqlen == 4) {
      c1 -= 0x10000;
      tmp_arr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)), String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
    } else {
      tmp_arr.push(String.fromCharCode(c1));
    }

    i += seqlen;
  }

  return tmp_arr.join("");
}
